/**
 *
 *
 * Socket functions Postgers is an alternative it may not be used
 *
 *
 */

import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger, OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { CLIENT_HOST, PORT, SERVER_HOST } from '@environments';
import { ConnectedRoomService } from 'src/connected-room/connected-room.service';
import { ConnectedUserService } from 'src/connected-user/connected-user.service';
import { RoomService } from 'src/room/room.service';
import { RoomsUsersService } from 'src/rooms-users/rooms-users.service';
import { LobbyUsersService } from 'src/lobby-users/lobby-users.service';
import { LobbiesService } from 'src/lobbies/lobbies.service';
import { ConnectedLobbyService } from 'src/connected-lobby/connected-lobby.service';
import { LobbyI } from 'src/lobbies/entities/lobby.interface';
import { RediskaService } from 'src/shared/services/rediska.service';
import { StatusLobby } from 'src/lobbies/entities/status-lobby';

@WebSocketGateway({
  cors: {
    origin: ['*', CLIENT_HOST, SERVER_HOST + ':' + PORT],
    credentials: true,
  },
})
export class SocketLobbyGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private connectedUserService: ConnectedUserService,
    private connectedRoomService: ConnectedRoomService,
    private roomService: RoomService,
    private roomsUsersService: RoomsUsersService,
    private lobbyService: LobbiesService,
    private lobbyUsersService: LobbyUsersService,
    private connectedLobbyService: ConnectedLobbyService,
    private rediskaService: RediskaService,
  ) {}

  async onModuleInit() {
    await this.connectedLobbyService.deleteAllConnection();

    Logger.debug(' > onModuleInitLobby');
  }

  @SubscribeMessage('createLobby')
  async onCreateLobby(
    @ConnectedSocket() socket: Socket,
    @MessageBody() lobby: LobbyI,
  ) {
    socket.data.sockets.forEach(async (socketSync) => {
      // *Postgres
      // Not implemented
      // *Redis
      this.rediskaService.addToRoom(
        lobby.id,
        socketSync.userId,
        socketSync.socketId,
      );

      // Sockets join
      this.server.sockets.sockets
        .get(socketSync.socketId)
        .join('lobby' + lobby.id);
    });

    // Inform user about successful created lobby
    this.server
      .to('uid' + socket.data.user.id)
      .emit('sync/lobbyCreated', lobby);

    Logger.debug(' > createLobby');
  }

  @SubscribeMessage('deleteLobby')
  async onDeleteLobby(
    @ConnectedSocket() socket: Socket,
    @MessageBody() lobby: LobbyI,
  ) {
    // *Postgres
    // Not implemented
    // *Redis
    const socketIds = await this.rediskaService.getAllByLobby(lobby.id);
    Object.keys(socketIds).forEach(async (socketId) => {
      this.server.sockets.sockets.get(socketId).leave('lobby' + lobby.id);
    });
    this.rediskaService.removeLobby(lobby.id);

    // Socket sync emit
    this.server.to('lobby' + lobby.id).emit('lobby/deleted', lobby);

    Logger.debug(' > deleteLobby ' + socket.data.user.username);
  }

  @SubscribeMessage('joinLobby')
  async onJoinLobby(
    @ConnectedSocket() socket: Socket,
    @MessageBody() lobby: LobbyI,
  ) {
    const newLobby = await this.lobbyService.getById(lobby.id);
    const users = await this.lobbyUsersService.getUsersByLobby(lobby);

    if (lobby.maxPlayers === users.length / 2) {
      this.server.to(socket.id).emit('lobby/joinError');
    } else {
      // Db update
      this.lobbyService.updateStatus(lobby.id, StatusLobby.PENDING);
      this.lobbyUsersService.addUserToLobby(lobby, socket.data.user);
      newLobby.users = users;
      newLobby.users.push(socket.data.user);

      // Socket sync emit
      this.server
        .to('lobby' + newLobby.id)
        .emit('lobby/userJoin', socket.data.user);
      this.server.to(socket.id).emit('lobby/joinLobby', newLobby);

      socket.data.sockets.forEach(async (socketSync) => {
        // *Postgres
        // Not implemented
        // *Redis
        this.rediskaService.addToLobby(
          lobby.id,
          socketSync.userId,
          socketSync.socketId,
        );
      });

      this.server
        .to('uid' + socket.data.user.id)
        .emit('sync/joinLobby', newLobby);
    }

    // Got message chat and emit
    // await this.server.to(socket.id).emit('messages', messages);
    // Logger.debug(' > joinRoom');
  }

  @SubscribeMessage('leaveLobby')
  async onLeaveLobby(
    @ConnectedSocket() socket: Socket,
    @MessageBody() lobby: LobbyI,
  ) {
    // *Postgres
    // Not implemented
    // *Redis
    this.rediskaService.removeFromLobby(lobby.id, socket.data.user.id);

    // Db update
    this.lobbyService.updateStatus(lobby.id, StatusLobby.PENDING);
    this.roomsUsersService.removeUser(socket.data.user);

    // Socket sync emit
    this.server
      .to('lobby' + lobby.id)
      .emit('lobby/userLeave', socket.data.user);
    this.server.to('uid' + socket.data.user.id).emit('sync/leaveLobby');

    Logger.debug(' > leaveRoom');
  }
}

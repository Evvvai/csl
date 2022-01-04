/**
 *
 *
 * Need separate postgres from redis
 * and put it into a separate service linked via rabbitmq
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
    private lobbyUsersSService: LobbyUsersService,
    private connectedLobbyService: ConnectedLobbyService,
  ) {}

  async onModuleInit() {
    // await this.connectedUserService.deleteAllConnection();

    Logger.debug(' > onModuleInitLobby');
  }

  @SubscribeMessage('createLobby')
  async onCreateRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() lobby: LobbyI,
  ) {
    socket.data.sockets.forEach(async (socketSync) => {
      this.connectedLobbyService.create({
        connectedUserId: socketSync.id,
        lobbyId: lobby.id,
      });
      this.server.sockets.sockets
        .get(socketSync.socketId)
        .join('lobby' + lobby.id);
    });

    this.server
      .to('uid' + socket.data.user.id)
      .emit('sync/lobbyCreated', lobby);

    Logger.debug(' > createLobby');
  }
}

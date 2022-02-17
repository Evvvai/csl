/**
 *
 *
 * Socket functions Postgers is an alternative it may not be used
 *
 *
 */

import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/users/entities/user.entity';
import { CLIENT_HOST, PORT, SERVER_HOST } from '@environments';
import { ConnectedRoomService } from 'src/connected-room/connected-room.service';
import { ConnectedUserService } from 'src/connected-user/connected-user.service';
import { RoomService } from 'src/room/room.service';
import {
  FriendI,
  StatusFriend,
} from 'src/friends-user/entities/friend.interface';
import { RoomsUsersService } from 'src/rooms-users/rooms-users.service';
import * as os from 'os';
import { RediskaService } from '../shared/services/rediska.service';
import { LobbiesService } from 'src/lobbies/lobbies.service';
import { LobbyUsersService } from 'src/lobby-users/lobby-users.service';

@WebSocketGateway({
  cors: {
    origin: ['*', CLIENT_HOST, SERVER_HOST + ':' + PORT],
    credentials: true,
  },
})
export class SocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    private readonly connectedUserService: ConnectedUserService,
    private readonly connectedRoomService: ConnectedRoomService,
    private readonly roomService: RoomService,
    private readonly roomsUsersService: RoomsUsersService,
    private readonly lobbyService: LobbiesService,
    private readonly lobbyUsersService: LobbyUsersService,

    public readonly rediskaService: RediskaService,
  ) {}

  async onModuleInit() {
    await this.connectedUserService.deleteAllConnection();
    await this.rediskaService.clear();

    Logger.debug(' > onModuleInit');
  }

  async afterInit(server: Server) {
    Logger.debug(' > afterInit ' + os.cpus().length);
  }

  private disconnect(socket: Socket) {
    socket.emit('error', new UnauthorizedException());
    socket.disconnect();
  }

  async handleConnection(@ConnectedSocket() socket: Socket) {
    try {
      const decodedToken = await this.authService.verifyJwt(
        socket.handshake.headers.authorization,
      );
      const user: User = await this.userService.findUserBySteamId64(
        decodedToken.steamId64,
      );

      if (!user) return this.disconnect(socket);

      /****************************************************************/

      // Save connection to DB
      // *Postgres
      // const connect = await this.connectedUserService.connectUser({
      //   socketId: socket.id,
      //   userId: user.id,
      // });
      // *Redis
      this.rediskaService.add(user.id, socket.id);

      socket.data.user = user;
      socket.join('uid' + user.id);

      // Check if user have active room or lobby
      const activeRoom = await this.roomsUsersService.getRoomByUser(
        socket.data.user,
      );

      if (activeRoom) {
        // *Postgres
        // this.connectedRoomService.create({
        //   socketId: socket.id,
        //   connectedUserId: socket.data.connectedId,
        //   roomId: activeRoom.roomId,
        // });
        // *Redis
        this.rediskaService.addToRoom(
          activeRoom.roomId,
          socket.data.user.id,
          socket.id,
        );
        socket.join('room' + activeRoom.roomId);
        this.server.to(socket.id).emit('room/joinRoom', activeRoom);

        console.log('a', activeRoom);
      } else {
        const activeLobby = await this.lobbyUsersService.getLobbyByUser(
          socket.data.user,
        );
        if (activeLobby) {
          // *Postgres
          // Not implemented
          // *Redis
          this.rediskaService.addToLobby(
            activeLobby.lobbyId,
            socket.data.user.id,
            socket.id,
          );
          socket.join('lobby' + activeLobby.lobbyId);
          this.server.to(socket.id).emit('lobby/joinLobby', activeLobby);

          console.log('b', activeRoom);
        }
      }

      // Gets all friends
      const allFriends = await this.userService.getAllFriends(user.id);
      // *Postgres
      // const onlineFriends = await this.connectedUserService.getConnects(
      //   allFriends.map((x) => x.id),
      // );
      // *Redis
      const onlineFriends = await this.rediskaService.getAllByIds(
        allFriends.map((x) => x.id),
      );

      const friends: FriendI[] = [...allFriends];
      friends.map((x) => {
        onlineFriends.find((y) => y.userId === x.id) !== undefined
          ? (x.online = true)
          : (x.online = false);

        x.status = {} as StatusFriend;
        x.status.action = '. . .';

        return x;
      });
      this.server.to(socket.id).emit('friend/load', friends);
      socket.data.friends = allFriends; // Might come in handy Sorry RAM )0))

      // Get all my connections
      // *Postgres
      // const allUserConnection = await this.connectedUserService.findConnect(
      //   user,
      // );
      // *Redis
      const allUserConnection = await this.rediskaService.getAll(user.id);

      socket.data.sockets = allUserConnection;
      allUserConnection.forEach((socketSync) => {
        this.server.sockets.sockets.get(socketSync).data.sockets =
          allUserConnection;
      });

      // Notife friend about user is online
      if (allUserConnection.length === 1) {
        onlineFriends.forEach((user) => {
          return this.server
            .to(user.socketId)
            .emit('friend/online', socket.data.user.id);
        });
      }

      Logger.debug(' > handleConnection | ' + socket.data.user.username);
      return this.server.to(socket.id).emit('connected');
    } catch (e) {
      return this.disconnect(socket);
    }
  }

  async handleDisconnect(socket: Socket) {
    if (!socket.data?.user?.id) return;
    // Remove connection
    // *Postgres
    // await this.connectedUserService.deleteBySocketId(socket.id);
    // const isLastConnect = await this.connectedUserService.findConnect(
    //   socket.data.user,
    // );
    // *Redis
    this.rediskaService.removeFromRoomBySocketId(socket.id);
    this.rediskaService.removeFromLobbyBySocketId(socket.id);
    await this.rediskaService.remove(socket.data.user.id, socket.id);
    const isLastConnect = await this.rediskaService.ammount(
      socket.data.user.id,
    );

    // Notify friend about user is offline and update last seen
    if (isLastConnect === 0) {
      this.userService.updateLastSeen(socket.data.user);

      if (!socket.data.friends) return;
      // *Postgres
      // const onlineFriends = await this.connectedUserService.getConnects(
      //   socket.data.friends.map((x) => x.id),
      // );
      // *Redis
      const onlineFriends = await this.rediskaService.getAllByIds(
        socket.data.friends.map((x) => x.id),
      );

      onlineFriends.forEach(async (user) => {
        this.server
          .to(user.socketId)
          .emit('friend/offline', socket.data.user.id);
      });
    }
    socket.disconnect();
    Logger.debug(' > handleDisconnect | ' + socket.data.user.username);
  }
}

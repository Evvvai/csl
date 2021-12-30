import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
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
import { ConnectedUserI } from 'src/connected-user/entities/connected-user.interface';
import { RoomsUsersService } from 'src/rooms-users/rooms-users.service';
import * as os from 'os';

@WebSocketGateway({
  cors: {
    origin: [
      'https://www.surfcombat.xyz',
      'https://apishka.xyz:8080',
      'https://apishka.xyz:8080/socket.io',
      'http://localhost:8080',
      'http://localhost:3000',
      CLIENT_HOST,
      SERVER_HOST + ':' + PORT,
    ],
    credentials: true,
  },
})
export class SocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  @WebSocketServer()
  server: Server;

  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private connectedUserService: ConnectedUserService,
    private connectedRoomService: ConnectedRoomService,
    private roomService: RoomService,
    private roomsUsersService: RoomsUsersService,
  ) {}

  async onModuleInit() {
    await this.connectedUserService.deleteAllConnection();
    Logger.debug(' > onModuleInit');
  }

  afterInit(server: Server) {
    const numCPUs = os.cpus().length;
    Logger.debug(' > afterInit ' + numCPUs);
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

      socket.data.sockets = [];
      socket.data.user = user;

      // Save connection to DB
      const connect = await this.connectedUserService.connectUser({
        socketId: socket.id,
        userId: user.id,
      });

      socket.data.connectedId = connect.id;

      // Check if user have active room
      const activeRoom = await this.roomsUsersService.getRoomByUser(
        socket.data.user,
      );

      if (activeRoom) {
        this.connectedRoomService.create({
          socketId: socket.id,
          connectedUserId: socket.data.connectedId,
          roomId: activeRoom.roomId,
        });
      }

      // Gets all friends
      const allFriends = await this.userService.getAllFriends(user.id);
      const onlineFriends = await this.connectedUserService.getConnects(
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

      // Find allready exist connection
      const allUserConnection = await this.connectedUserService.findConnect(
        user,
      );

      // Notife friend about user is online
      if (allUserConnection.length === 1) {
        onlineFriends.forEach((user) => {
          return this.server
            .to(user.socketId)
            .emit('friend/online', socket.data.user.id);
        });
      }

      // Sync socket connection
      if (allUserConnection.length > 1) {
        // Save my another sockets
        allUserConnection.forEach((socket) => {
          this.server.to(socket.socketId).emit('sync', allUserConnection);
        });

        // Sync allready exist room
        const isHaveRoom = await this.connectedRoomService.findRoomBySocketIds(
          allUserConnection.map((val) => val.socketId),
        );

        if (isHaveRoom)
          await this.connectedRoomService.create({
            socketId: socket.id,
            connectedUserId: socket.data.connectedId,
            roomId: isHaveRoom.roomId,
          });
      }

      Logger.debug(' > handleConnection', socket.data.user.username);
      return this.server.to(socket.id).emit('connected');
    } catch (e) {
      return this.disconnect(socket);
    }
  }

  async handleDisconnect(socket: Socket) {
    await this.connectedUserService.deleteBySocketId(socket.id);
    const isLastConnect = await this.connectedUserService.findConnect(
      socket.data.user,
    );

    // Notify friend about user is offline and update last seen
    if (isLastConnect.length === 0) {
      this.userService.updateLastSeen(socket.data.user);

      if (!socket.data.friends) return;
      const onlineFriends = await this.connectedUserService.getConnects(
        socket.data.friends.map((x) => x.id),
      );

      onlineFriends.forEach((user) => {
        return this.server
          .to(user.socketId)
          .emit('friend/offline', socket.data.user.id);
      });
    }
    socket.disconnect();
    Logger.debug(' > handleDisconnect', socket.data.user.username);
  }

  // @SubscribeMessage('connection')
  // async newConnection(socket: Socket, room: any) {
  //   console.log('connection');
  // }

  /**
   *
   * Sync
   *
   **/

  @SubscribeMessage('sync')
  async syncSockets(socket: Socket, socketIds: ConnectedUserI[]) {
    Logger.debug(' > sync');
    socket.data.sockets = socketIds.filter((val) => val.socketId !== socket.id);
  }
}

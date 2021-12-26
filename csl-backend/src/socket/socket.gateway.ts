import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/users/entities/user.entity';
import { CLIENT_HOST } from '@environments';
import { ConnectedRoomService } from 'src/connected-room/connected-room.service';
import { ConnectedUserService } from 'src/connected-user/connected-user.service';
import { RoomI } from 'src/room/entities/room.interface';
import { RoomService } from 'src/room/room.service';
import { FriendI } from 'src/friends-user/entities/friend.interface';
import { ConnectedUserI } from 'src/connected-user/entities/connected-user.interface';
// import { InjectConnection } from '@nestjs/typeorm';
// import { Connection } from 'typeorm';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:8080', 'http://localhost:3000', CLIENT_HOST],
  },
})
export class SocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  @WebSocketServer()
  server: Server;

  constructor(
    // @InjectConnection('db')
    // private connection: Connection,

    private userService: UsersService,
    private authService: AuthService,
    private connectedUserService: ConnectedUserService,
    private connectedRoomService: ConnectedRoomService,
    private roomService: RoomService,
  ) {}

  async onModuleInit() {
    await this.connectedUserService.deleteAllConnection();
    await this.roomService.deleteAllRooms();
    // await this.connectedRoomService.deleteAllConnection();
    console.log('onModuleInit');
  }

  private disconnect(socket: Socket) {
    socket.emit('error', new UnauthorizedException());
    socket.disconnect();
  }

  async handleConnection(socket: Socket) {
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

      // Gets all friends
      const allFriends = await this.userService.getAllFriends(user.id);
      const onlineFriends = await this.connectedUserService.getConnects(
        allFriends.map((x) => x.id),
      );
      const friends: FriendI[] = [...allFriends];
      friends.map((x) => {
        onlineFriends.find((y) => y.userId === x.id) !== undefined
          ? (x.status = true)
          : (x.status = false);

        return x;
      });
      this.server.to(socket.id).emit('loadFriends', friends);
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
            .emit('friendOnline', socket.data.user.id);
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

      console.log(' > handleConnection', socket.data.user.username);
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

    // Notify friend about user is offline
    if (isLastConnect.length === 0) {
      const onlineFriends = await this.connectedUserService.getConnects(
        socket.data.friends.map((x) => x.id),
      );

      onlineFriends.forEach((user) => {
        return this.server
          .to(user.socketId)
          .emit('friendOffline', socket.data.user.id);
      });
    }
    socket.disconnect();
    console.log(' > handleDisconnect', socket.data.user.username);
  }

  // @SubscribeMessage('connection')
  // async newConnection(socket: Socket, room: any) {
  //   console.log('connection');
  // }

  @SubscribeMessage('createRoom')
  async onCreateRoom(socket: Socket, room: RoomI) {
    const newRoom = await this.connectedRoomService.create({
      socketId: socket.id,
      connectedUserId: socket.data.connectedId,
      roomId: room.id,
    });

    socket.data.sockets.forEach(async (val) => {
      await this.connectedRoomService.create({
        socketId: val.socketId,
        connectedUserId: val.id,
        roomId: newRoom.roomId,
      });

      this.server.to(val.socketId).emit('syncRoomCreated', room);
    });

    console.log('createRoom');
  }

  @SubscribeMessage('joinRoom')
  async onJoinRoom(socket: Socket, room: RoomI) {
    await this.connectedRoomService.create({
      socketId: socket.id,
      connectedUserId: socket.data.connectedId,
      roomId: room.id,
    });
    // Got message chat and emit
    // await this.server.to(socket.id).emit('messages', messages);
    console.log('joinRoom');
  }

  @SubscribeMessage('leaveRoom')
  async onLeaveRoom(socket: Socket, room: RoomI) {
    await this.connectedRoomService.deleteBySocketId(socket.id);
    console.log('leaveRoom');
  }

  @SubscribeMessage('deleteRoom')
  async onDeleteRoom(socket: Socket, room: RoomI) {
    const connectedRooms = await this.connectedRoomService.findByRoom(room);

    console.log('connectedRooms', connectedRooms);

    connectedRooms.forEach((user) => {
      this.server.to(user.socketId).emit('roomDeleted', room);
    });

    this.roomService.deleteRoom(room);

    // console.log('deleteRoom | ', deletedRoom);
  }

  @SubscribeMessage('sync')
  async syncSockets(socket: Socket, socketIds: ConnectedUserI[]) {
    console.log('sync');
    socket.data.sockets = socketIds.filter((val) => val.socketId !== socket.id);
  }
}

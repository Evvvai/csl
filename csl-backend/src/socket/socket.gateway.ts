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
    private userService: UsersService,
    private authService: AuthService,
    private connectedUserService: ConnectedUserService,
    private connectedRoomService: ConnectedRoomService,
    private roomService: RoomService,
  ) {}

  async onModuleInit() {
    // await this.connectedUserService.deleteAllConnection();
    // await this.roomService.deleteAllRooms();
    // await this.connectedRoomService.deleteAllConnection();
    console.log('onModuleInit');
  }

  async handleConnection(socket: Socket) {
    try {
      const decodedToken = await this.authService.verifyJwt(
        socket.handshake.headers.authorization,
      );
      const user: User = await this.userService.findUserBySteamId64(
        decodedToken.steamId64,
      );

      const isFirstConnect = await this.connectedUserService.findConnect(user);
      if (isFirstConnect === undefined) {
        // Notife friend about user is online
        // const query = await this.roomsUsersRepository
        //   .createQueryBuilder('r')
        //   .leftJoinAndSelect('r.user', 'users')
        //   .getMany();
        // const users = query.map((x) => x.user);
      }

      if (user) {
        socket.data.user = user;

        // Save connection to DB
        const connect = await this.connectedUserService.connectUser({
          socketId: socket.id,
          user,
        });

        socket.data.connectedId = connect.id;

        console.log('handleConnection');
        return this.server.to(socket.id).emit('connected', 'Active connect!');
      } else {
        return this.disconnect(socket);
      }
    } catch (e) {
      return this.disconnect(socket);
    }
  }

  async handleDisconnect(socket: Socket) {
    await this.connectedUserService.deleteBySocketId(socket.id);
    const isLastConnect = await this.connectedUserService.findConnect(
      socket.data.user,
    );
    console.log('isLastConnect.length', isLastConnect.length);

    if (isLastConnect.length === 0) {
      // Notify friend about user is offline
      // this.server.to(socket.id).emit('connected', 'Active connect!');
    }
    socket.disconnect();
    console.log('handleDisconnect');
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    console.log('disconnect');
    socket.disconnect();
  }

  // @SubscribeMessage('connection')
  // async newConnection(socket: Socket, room: any) {
  //   console.log('connection');
  // }

  @SubscribeMessage('createRoom')
  async onCreateRoom(socket: Socket, room: RoomI) {
    await this.connectedRoomService.create({
      socketId: socket.id,
      connectedUserId: socket.data.connectedId,
      room,
    });
    console.log('createRoom');
  }

  @SubscribeMessage('joinRoom')
  async onJoinRoom(socket: Socket, room: RoomI) {
    await this.connectedRoomService.create({
      socketId: socket.id,
      connectedUserId: socket.data.connectedId,
      room,
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

    connectedRooms.forEach((user) => {
      this.server.to(user.socketId).emit('roomDeleted', room);
    });

    const deletedRoom = await this.roomService.deleteRoom(room);

    console.log('deleteRoom | ', deletedRoom);
  }
}

import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger, OnModuleInit } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { CLIENT_HOST, PORT, SERVER_HOST } from '@environments';
import { ConnectedRoomService } from 'src/connected-room/connected-room.service';
import { ConnectedUserService } from 'src/connected-user/connected-user.service';
import { RoomI } from 'src/room/entities/room.interface';
import { RoomService } from 'src/room/room.service';
import { UserI } from 'src/users/entities/user.interface';
import { RoomsUsersService } from 'src/rooms-users/rooms-users.service';

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
export class SocketInviteGateway implements OnModuleInit {
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
    Logger.debug(' > onModuleInitInvite');
  }

  @SubscribeMessage('removeInvite')
  async onRmoveInvite(socket: Socket, payload: { user: UserI; room: RoomI }) {
    const invite = {
      user: socket.data.user,
      room: payload.room,
      sentAt: new Date().getTime(),
      ttl: 10 * 60,
    };

    const connectedUsers = await this.connectedUserService.findConnect(
      payload.user,
    );

    connectedUsers.forEach((user) => {
      this.server
        .to(user.socketId)
        .emit('notification/removeUserInvite', invite);
    });

    // Logger.debug(' > removeInvite');
  }

  @SubscribeMessage('sentInvite')
  async onSentInvite(socket: Socket, payload: { user: UserI; room: RoomI }) {
    const invite = {
      user: socket.data.user,
      room: payload.room,
      sentAt: new Date().getTime(),
      ttl: 10 * 60,
    };

    const connectedUsers = await this.connectedUserService.findConnect(
      payload.user,
    );

    connectedUsers.forEach((user) => {
      this.server.to(user.socketId).emit('notification/invite', invite);
    });

    // Logger.debug(' > sentInvite');
  }

  @SubscribeMessage('declineInvite')
  async onDeclineInvite(socket: Socket, payload: { user: UserI; room: RoomI }) {
    const invite = {
      user: socket.data.user,
      room: payload.room,
      sentAt: new Date().getTime(),
      ttl: 10 * 60,
    };

    socket.data.sockets.forEach(async (connect) => {
      this.server
        .to(connect.socketId)
        .emit('notification/removeUserInvite', payload);
    });

    const connectedUsers = await this.connectedUserService.findConnect(
      payload.user,
    );

    connectedUsers.forEach((user) => {
      this.server.to(user.socketId).emit('friend/declineInvite', invite);
    });

    // Logger.debug(' > declineInvite');
  }
}

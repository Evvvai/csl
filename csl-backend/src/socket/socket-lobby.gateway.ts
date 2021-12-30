import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Logger, OnModuleInit } from '@nestjs/common';
import { Server } from 'socket.io';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { CLIENT_HOST, PORT, SERVER_HOST } from '@environments';
import { ConnectedRoomService } from 'src/connected-room/connected-room.service';
import { ConnectedUserService } from 'src/connected-user/connected-user.service';
import { RoomService } from 'src/room/room.service';
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
  ) {}

  async onModuleInit() {
    // await this.connectedUserService.deleteAllConnection();

    Logger.debug(' > onModuleInitLobby');
  }
}

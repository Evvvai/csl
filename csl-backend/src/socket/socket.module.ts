import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from '../auth/auth.module';
import { ConnectedUserModule } from '../connected-user/connected-user.module';
import { ConnectedRoomModule } from '../connected-room/connected-room.module';
import { RoomModule } from 'src/room/room.module';
import { RoomsUsersModule } from 'src/rooms-users/rooms-users.module';
import { SocketRoomGateway } from './socket-room.gateway';
import { SocketInviteGateway } from './socket-invite.gateway';
import { SocketLobbyGateway } from './socket-lobby.gateway';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ConnectedUserModule,
    ConnectedRoomModule,
    RoomModule,
    RoomsUsersModule,
  ],
  providers: [
    SocketGateway,
    SocketRoomGateway,
    SocketInviteGateway,
    SocketLobbyGateway,
  ],
})
export class SocketModule {}

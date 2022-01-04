import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { AuthModule } from '../auth/auth.module';
import { ConnectedUserModule } from '../connected-user/connected-user.module';
import { ConnectedRoomModule } from '../connected-room/connected-room.module';
import { SocketRoomGateway } from './socket-room.gateway';
import { SocketInviteGateway } from './socket-invite.gateway';
import { SocketLobbyGateway } from './socket-lobby.gateway';
import { ConnectedLobbyModule } from '../connected-lobby/connected-lobby.module';
import { LobbiesModule } from '../lobbies/lobbies.module';
import { LobbyUsersModule } from '../lobby-users/lobby-users.module';
import { RoomModule } from '../room/room.module';
import { UsersModule } from '../users/users.module';
import { RoomsUsersModule } from '../rooms-users/rooms-users.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConnectedUserModule,
    RoomModule,
    RoomsUsersModule,
    ConnectedRoomModule,
    LobbiesModule,
    LobbyUsersModule,
    ConnectedLobbyModule,
  ],
  providers: [
    SocketGateway,
    SocketRoomGateway,
    SocketInviteGateway,
    SocketLobbyGateway,
  ],
})
export class SocketModule {}

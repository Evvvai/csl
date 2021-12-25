import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from '../auth/auth.module';
import { ConnectedUserModule } from '../connected-user/connected-user.module';
import { ConnectedRoomModule } from '../connected-room/connected-room.module';
import { RoomModule } from 'src/room/room.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ConnectedUserModule,
    ConnectedRoomModule,
    RoomModule,
  ],
  providers: [SocketGateway],
})
export class SocketModule {}

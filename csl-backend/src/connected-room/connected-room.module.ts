import { Module } from '@nestjs/common';
import { ConnectedRoomService } from './connected-room.service';
import { ConnectedRoomResolver } from './connected-room.resolver';
import { ConnectedRoom } from './entities/connected-room.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ConnectedRoom])],
  providers: [ConnectedRoomResolver, ConnectedRoomService],
  exports: [ConnectedRoomService],
})
export class ConnectedRoomModule {}

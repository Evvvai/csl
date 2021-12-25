import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomResolver } from './room.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { RoomsUsersModule } from 'src/rooms-users/rooms-users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Room]), RoomsUsersModule],
  providers: [RoomResolver, RoomService],
  exports: [RoomService],
})
export class RoomModule {}

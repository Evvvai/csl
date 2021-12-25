import { Module } from '@nestjs/common';
import { RoomsUsersService } from './rooms-users.service';
import { RoomsUsersResolver } from './rooms-users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsUsers } from './entities/rooms-users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoomsUsers])],
  providers: [RoomsUsersResolver, RoomsUsersService],
  exports: [RoomsUsersService],
})
export class RoomsUsersModule {}

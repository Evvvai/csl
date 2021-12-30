import { Module } from '@nestjs/common';
import { LobbyUsersService } from './lobby-users.service';
import { LobbyUsersResolver } from './lobby-users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LobbyUser } from './entities/lobby-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LobbyUser])],
  providers: [LobbyUsersResolver, LobbyUsersService],
})
export class LobbyUsersModule {}

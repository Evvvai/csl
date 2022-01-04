import { Module } from '@nestjs/common';
import { LobbiesService } from './lobbies.service';
import { LobbiesResolver } from './lobbies.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lobby } from './entities/lobby.entity';
import { LobbyUsersModule } from '../lobby-users/lobby-users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Lobby]), LobbyUsersModule],
  providers: [LobbiesResolver, LobbiesService],
  exports: [LobbiesService],
})
export class LobbiesModule {}

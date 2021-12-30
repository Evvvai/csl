import { Module } from '@nestjs/common';
import { LobbiesService } from './lobbies.service';
import { LobbiesResolver } from './lobbies.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lobby } from './entities/lobby.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lobby])],
  providers: [LobbiesResolver, LobbiesService],
})
export class LobbiesModule {}

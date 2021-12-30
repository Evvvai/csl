import { Module } from '@nestjs/common';
import { ConnectedLobbyService } from './connected-lobby.service';
import { ConnectedLobbyResolver } from './connected-lobby.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectedLobby } from './entities/connected-lobby.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConnectedLobby])],
  providers: [ConnectedLobbyResolver, ConnectedLobbyService],
  exports: [ConnectedLobbyService],
})
export class ConnectedLobbyModule {}

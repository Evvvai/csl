import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConnectedLobby } from './entities/connected-lobby.entity';
import { ConnectedLobbyI } from './entities/connected-lobby.interface';

@Injectable()
export class ConnectedLobbyService {
  constructor(
    @InjectRepository(ConnectedLobby)
    private connectedLobbyRepository: Repository<ConnectedLobby>,
  ) {}

  async create(connectedLobby: ConnectedLobbyI): Promise<ConnectedLobbyI> {
    return this.connectedLobbyRepository.save(connectedLobby);
  }

  async deleteAllConnection() {
    await this.connectedLobbyRepository.createQueryBuilder().delete().execute();
  }
}

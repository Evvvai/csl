import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConnectedLobby } from './entities/connected-lobby.entity';

@Injectable()
export class ConnectedLobbyService {
  constructor(
    @InjectRepository(ConnectedLobby)
    private connectedLobbyRepository: Repository<ConnectedLobby>,
  ) {}
}

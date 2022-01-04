import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LobbyI } from 'src/lobbies/entities/lobby.interface';
import { UserI } from 'src/users/entities/user.interface';
import { Repository } from 'typeorm';
import { LobbyUser } from './entities/lobby-user.entity';
import { LobbyUserI } from './entities/lobby-user.interface';

@Injectable()
export class LobbyUsersService {
  constructor(
    @InjectRepository(LobbyUser)
    private lobbyUsersRepository: Repository<LobbyUser>,
  ) {}

  async addUserToLobby(lobby: LobbyI, user: UserI): Promise<LobbyUserI> {
    return this.lobbyUsersRepository.save({
      lobbyId: lobby.id,
      userId: user.id,
    });
  }
}

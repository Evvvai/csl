import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserI } from 'src/users/entities/user.interface';
import { Repository } from 'typeorm';
import { CreateLobbyInput } from './dto/create-lobby.input';
import { Lobby } from './entities/lobby.entity';
import { LobbyUsersService } from '../lobby-users/lobby-users.service';

@Injectable()
export class LobbiesService {
  constructor(
    @InjectRepository(Lobby)
    private lobbyRepository: Repository<Lobby>,

    private lobbyUsersService: LobbyUsersService,
  ) {}

  async create(user: UserI, createRoomInput: CreateLobbyInput) {
    const lobby = await this.lobbyRepository.create({
      maxPlayers: createRoomInput.maxPlayers,
      captainId: user.id,
    });
    const newLobby = await this.lobbyRepository.save(lobby);
    await this.lobbyUsersService.addUserToLobby(newLobby, user);
    return newLobby;
  }
}

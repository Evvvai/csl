import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserI } from 'src/users/entities/user.interface';
import { Repository } from 'typeorm';
import { CreateLobbyInput } from './dto/create-lobby.input';
import { Lobby } from './entities/lobby.entity';
import { LobbyUsersService } from '../lobby-users/lobby-users.service';
import { StatusLobby } from './entities/status-lobby';
import { LobbyI } from './entities/lobby.interface';
import { PaginationOptionsI } from 'src/shared/types';

@Injectable()
export class LobbiesService {
  constructor(
    @InjectRepository(Lobby)
    private lobbyRepository: Repository<Lobby>,

    private lobbyUsersService: LobbyUsersService,
  ) {}

  async getAll(options: PaginationOptionsI): Promise<LobbyI[]> {
    return this.lobbyRepository
      .createQueryBuilder('l')
      .offset(options.page * options.limit)
      .limit(options.limit)
      .getMany();
  }

  async getById(id: number): Promise<LobbyI> {
    return await this.lobbyRepository.findOne({ where: { id } });
  }

  async getLobbyForUser(user: UserI): Promise<LobbyI> {
    const lobby = await this.lobbyUsersService.getLobbyByUser(user);

    if (!lobby) return new Lobby();
    return await this.lobbyRepository.findOne({ where: { id: lobby.lobbyId } });
  }

  async create(user: UserI, input: CreateLobbyInput) {
    const lobby = await this.lobbyRepository.create({
      maxPlayers: input.maxPlayers,
      captainId: user.id,
    });
    const newLobby = await this.lobbyRepository.save(lobby);
    await this.lobbyUsersService.addUserToLobby(newLobby, user);

    return newLobby;
  }

  async delete(lobby: LobbyI) {
    return this.lobbyRepository.delete({ id: lobby.id });
  }

  async updateStatus(id: number, status: StatusLobby) {
    return this.lobbyRepository
      .createQueryBuilder()
      .update(Lobby)
      .set({ status: status })
      .where('id = :id', { id: id })
      .execute();
  }
}

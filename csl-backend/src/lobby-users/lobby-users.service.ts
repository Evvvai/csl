import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LobbyI } from 'src/lobbies/entities/lobby.interface';
import { UserI } from 'src/users/entities/user.interface';
import { Repository } from 'typeorm';
import { LobbyUser } from './entities/lobby-user.entity';
import { LobbyUserI } from './entities/lobby-user.interface';
import { User } from '../users/entities/user.entity';
import { Teams } from './entities/teams.enum';
import { UsersTeamInput } from 'src/lobbies/dto/users-team.input';

@Injectable()
export class LobbyUsersService {
  constructor(
    @InjectRepository(LobbyUser)
    private lobbyUsersRepository: Repository<LobbyUser>,
  ) {}

  async getLobbyByUser(user: UserI): Promise<LobbyUserI> {
    return this.lobbyUsersRepository.findOne({ where: { userId: user.id } });
  }

  async getUsersByLobby(
    lobby: LobbyI,
    team?: UsersTeamInput,
  ): Promise<UserI[]> {
    // const query = await this.lobbyUsersRepository
    //   .createQueryBuilder('r')
    //   .leftJoinAndSelect('r.user', 'users')
    //   .where('r.team = :teamName', {
    //     teamName: team.name ? team.name : Teams.T,
    //   })
    //   .orWhere('r.team = :teamName', {
    //     teamName: team.name ? team.name : Teams.CT,
    //   })
    //   .andWhere('r.lobbyId = :lobbyId', {
    //     lobbyId: lobby.id,
    //   })
    //   .getMany();

    const query = await this.lobbyUsersRepository
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.user', 'users')
      .where('r.lobbyId = :lobbyId', {
        lobbyId: lobby.id,
      })
      .andWhere('r.team = :teamName', {
        teamName: team.name,
      })
      .getMany();

    const users = query.map((x) => x.user);

    return users;
  }

  async addUserToLobby(lobby: LobbyI, user: UserI): Promise<LobbyUserI> {
    return this.lobbyUsersRepository.save({
      lobbyId: lobby.id,
      userId: user.id,
    });
  }
}

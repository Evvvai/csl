import {
  Resolver,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Query,
  registerEnumType,
} from '@nestjs/graphql';
import { LobbiesService } from './lobbies.service';
import { Lobby } from './entities/lobby.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CtxUser } from '../auth/decorators/ctx-user.decorator';
import { CreateLobbyInput } from './dto/create-lobby.input';
import { User } from '../users/entities/user.entity';
import { LobbyUsersService } from 'src/lobby-users/lobby-users.service';
import { Teams } from 'src/lobby-users/entities/teams.enum';
import { UsersTeamInput } from './dto/users-team.input';

@Resolver(() => Lobby)
export class LobbiesResolver {
  constructor(
    private readonly lobbiesService: LobbiesService,

    private readonly roomsUsersService: LobbyUsersService,
  ) {}

  @Query(() => [Lobby])
  async lobbies(
    @Args('page', { nullable: true }) page: number,
    @Args('limit', { nullable: true }) limit: number,
  ) {
    limit = !limit ? 10 : limit;
    limit = limit > 100 ? 100 : limit;
    page = page === undefined ? 0 : page;

    return await this.lobbiesService.getAll({
      page,
      limit,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Lobby)
  async createLobby(
    @CtxUser() user: User,
    @Args('input') input: CreateLobbyInput,
  ) {
    return await this.lobbiesService.create(user, input);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Lobby)
  async activeLobby(@CtxUser() user: User) {
    return await this.lobbiesService.getLobbyForUser(user);
  }

  // Resolve
  @ResolveField(() => [User], { name: 'users' })
  users(@Parent() lobby: Lobby) {
    return this.roomsUsersService.getUsersByLobby(lobby);
  }

  @ResolveField(() => [User], { name: 'usersTeam', nullable: true })
  usersTeam(
    @Parent() lobby: Lobby,
    @Args('input', { nullable: true }) input: UsersTeamInput,
  ) {
    return this.roomsUsersService.getUsersByLobby(lobby, input);
  }
}

import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LobbyUsersService } from './lobby-users.service';
import { LobbyUser } from './entities/lobby-user.entity';

@Resolver(() => LobbyUser)
export class LobbyUsersResolver {
  constructor(private readonly lobbyUsersService: LobbyUsersService) {}
}

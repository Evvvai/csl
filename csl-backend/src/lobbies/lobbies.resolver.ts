import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LobbiesService } from './lobbies.service';
import { Lobby } from './entities/lobby.entity';

@Resolver(() => Lobby)
export class LobbiesResolver {
  constructor(private readonly lobbiesService: LobbiesService) {}

  @Query(() => [Lobby], { name: 'lobbies' })
  findAll() {
    return this.lobbiesService.findAll();
  }
}

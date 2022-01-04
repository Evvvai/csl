import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { LobbiesService } from './lobbies.service';
import { Lobby } from './entities/lobby.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CtxUser } from '../auth/decorators/ctx-user.decorator';
import { CreateLobbyInput } from './dto/create-lobby.input';
import { User } from '../users/entities/user.entity';

@Resolver(() => Lobby)
export class LobbiesResolver {
  constructor(private readonly lobbiesService: LobbiesService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Lobby)
  createLobby(
    @CtxUser() user: User,
    @Args('input') createLobbyInput: CreateLobbyInput,
  ) {
    return this.lobbiesService.create(user, createLobbyInput);
  }
}

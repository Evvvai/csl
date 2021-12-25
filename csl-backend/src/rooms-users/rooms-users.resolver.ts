import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RoomsUsersService } from './rooms-users.service';
import { RoomsUsers } from './entities/rooms-users.entity';

@Resolver(() => RoomsUsers)
export class RoomsUsersResolver {
  constructor(private readonly roomsUsersService: RoomsUsersService) {}
}

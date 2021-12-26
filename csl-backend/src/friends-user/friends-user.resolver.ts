import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FriendsUserService } from './friends-user.service';
import { FriendsUser } from './entities/friends-user.entity';
import { FriendsUserI } from './entities/friends-user.interface';

@Resolver(() => FriendsUser)
export class FriendsUserResolver {
  constructor(private readonly friendsUserService: FriendsUserService) {}
}

import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CtxUser } from 'src/auth/decorators/ctx-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from './entities/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserI } from './entities/user.interface';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.ADMIN, Role.PREMIUM)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [User])
  users(@CtxUser() user: User): Promise<User[]> {
    return this.usersService.getAll();
  }

  @Query(() => User)
  findOne(@Args('steamid64') steamid64: string): Promise<User> {
    return this.usersService.findUserBySteamId64(steamid64);
  }

  @Query(() => [User])
  friends(@Args('userId') userId: number): Promise<User[]> {
    return this.usersService.getAllFriends(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => User)
  setAvatar(@CtxUser() user: User, @Args('url') url: string): Promise<User> {
    return this.usersService.updateAvatar(user, url);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => User)
  setDashboard(@CtxUser() user: User, @Args('url') url: string): Promise<User> {
    return this.usersService.updateDashboard(user, url);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => [User])
  userNewFriends(@CtxUser() user: User) {
    return this.usersService.updateFriends(user);
  }
}

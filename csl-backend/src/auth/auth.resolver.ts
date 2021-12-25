import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { CtxUser } from './decorators/ctx-user.decorator';
import { UserToken } from './entities/user-token';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly service: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => UserToken)
  auth(@CtxUser() user: User) {
    return this.service.auth(user);
  }

  // Need impelement graphQL version if possible )0))
  // Steam
  // @Query(() => Boolean)
  // @UseGuards(SteamAuthGuard)
  // steamLogin() {
  //   console.log('Calls Steam strategy');
  //   return true;
  // } // Calls Steam strategy

  // @Query()
  // @UseGuards(SteamAuthGuard)
  // steamLoginCallback(@ReqUser() user: User | null, @Res() res) {
  //   this.authService.handleLogin(user, res);
  // }
}

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './entities/user-token';
import { UsersService } from '../users/users.service';
import { Role } from '../users/entities/role.enum';
import { CLIENT_HOST } from '@environments';
import { JwtDto } from './dto/jwt.dto';
import { User } from 'src/users/entities/user.entity';
import { SteamAPIAuthService } from './steamapi-auth.service';
import { FriendsUserService } from 'src/friends-user/friends-user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly usersService: UsersService,
    private readonly steamAPIAuthService: SteamAPIAuthService,
    private readonly friendsUserService: FriendsUserService,
  ) {}

  public async auth(user: User): Promise<UserToken> {
    // try {
    //   if (user) {
    //     const userProfile = await this.steamAPIAuthService.getUserInfo(
    //       user.steamId64,
    //     );
    //     user = await this.usersService.updateUser(userProfile);
    //   }
    // } catch {
    //   console.log('Steam sleep...');
    // }

    return { user, token: this.signToken(user.steamId64, user.role) };
  }

  signToken(steamId64: string, role: Role) {
    const payload: JwtDto = { steamId64, role };

    return this.jwt.sign(payload);
  }

  verifyJwt(jwt: string): Promise<any> {
    return this.jwt.verifyAsync(jwt);
  }

  public async validateUser(steamId64: string): Promise<User | null> {
    const user = await this.usersService.findUserBySteamId64(steamId64);
    /**
     * Some stuff
     */
    return user;
  }

  // Steam validate
  public async steamValidation(req: any, profile: any): Promise<User | null> {
    console.log('profile.steamid', profile.id);

    let user = await this.usersService.findUserBySteamId64(profile.id);

    if (!user) {
      if (!(await this.steamAPIAuthService.canUserRegister(profile.id))) {
        return null;
      }
      console.log('aaa');

      const userProfile = await this.steamAPIAuthService.getUserInfo(
        profile.id,
      );

      user = await this.usersService.registerUser(userProfile);

      const userFriends = await this.steamAPIAuthService.getUserFriends(
        profile.id,
      );

      if (userFriends) {
        const friendsSteamid = userFriends.map((x) => x.steamid);
        const friends = await this.usersService.getAllPossibleFriends(
          user,
          friendsSteamid,
        );
        if (friends) {
          this.friendsUserService.addFriends(user, friends);
        }
      }
    }

    return user;
  }

  authSteam(user: User, res: any) {
    if (!user) {
      res.redirect(`${CLIENT_HOST}/signin`);
      return;
    }

    const JWT = this.signToken(user.steamId64, user.role);

    res.redirect(`${CLIENT_HOST}/auth/?token=${JWT}`);
  }
}

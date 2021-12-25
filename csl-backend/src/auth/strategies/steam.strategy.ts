import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-steam';
import { User } from '../../users/entities/user.entity';
import { PORT, STEAM_API_KEY, SERVER_HOST } from '@environments';

import { AuthService } from '../auth.service';

@Injectable()
export class SteamStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      returnURL: `${SERVER_HOST + ':' + PORT}/auth/steam/return`,
      realm: SERVER_HOST + ':' + PORT,
      apiKey: STEAM_API_KEY,
      passReqToCallback: true, // Neat trick to pass down the request
    });
  }

  async validate(
    req: any,
    identifier: any,
    profile: any,
    done: any,
  ): Promise<User | null> {
    return await this.authService.steamValidation(req, profile);
  }
}

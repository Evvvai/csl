/* eslint-disable @typescript-eslint/no-empty-function */
import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { SteamAuthGuard } from './guards/steam-auth.guard';
import { AuthService } from './auth.service';
import { ReqUser } from './decorators/req-user.paramdecorator';
import { User } from 'src/users/entities/user.entity';

@Controller({ path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('steam')
  @UseGuards(SteamAuthGuard)
  steamLogin() {}

  @Get('steam/return')
  @UseGuards(SteamAuthGuard)
  steamLoginCallback(@ReqUser() user: User | null, @Res() res) {
    this.authService.authSteam(user, res);
  }
}

import { JWT_SECRET } from '@environments';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { SteamAPIAuthService } from './steamapi-auth.service';
import { PassportModule } from '@nestjs/passport';
import { SteamStrategy } from './strategies/steam.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    HttpModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: JWT_SECRET,
      }),
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthResolver,
    AuthService,
    SteamAPIAuthService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    SteamStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}

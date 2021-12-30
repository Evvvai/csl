import { CacheModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { CacheService, LoggingInterceptor } from './config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigService } from './shared/services/config.service';

// Module
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SocketModule } from './socket/socket.module';
import { RoomModule } from './room/room.module';
import { ConnectedUserModule } from './connected-user/connected-user.module';
import { ConnectedRoomModule } from './connected-room/connected-room.module';
import { RoomsUsersModule } from './rooms-users/rooms-users.module';
import { FriendsUserModule } from './friends-user/friends-user.module';
import { ConnectedLobbyModule } from './connected-lobby/connected-lobby.module';
import { LobbyUsersModule } from './lobby-users/lobby-users.module';
import { LobbiesModule } from './lobbies/lobbies.module';
import { SharedModule } from './shared/shared.module';
import { RedisModule } from 'nestjs-redis';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      cors: {
        origin: '*',
        credentials: true,
      },
    }),
    CacheModule.registerAsync({
      useClass: CacheService,
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ConfigService) => configService.typeOrmConfig,
      inject: [ConfigService],
    }),
    // RedisModule.register({ url: 'redis://127.0.0.1:6379/0' }),
    UsersModule,
    AuthModule,
    SocketModule,
    RoomModule,
    ConnectedRoomModule,
    ConnectedUserModule,
    RoomsUsersModule,
    FriendsUserModule,
    LobbiesModule,
    ConnectedLobbyModule,
    LobbyUsersModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}

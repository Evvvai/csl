import { CacheModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NODE_ENV, TYPEORM_MAIN } from '@environments';
import { join } from 'path';
import { CacheService, LoggingInterceptor } from './config';
import { APP_INTERCEPTOR } from '@nestjs/core';

// Module
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SocketModule } from './socket/socket.module';
import { RoomModule } from './room/room.module';
import { ConnectedUserModule } from './connected-user/connected-user.module';
import { ConnectedRoomModule } from './connected-room/connected-room.module';
import { RoomsUsersModule } from './rooms-users/rooms-users.module';

// Entity
import { User } from './users/entities/user.entity';
import { Room } from './room/entities/room.entity';
import { ConnectedRoom } from './connected-room/entities/connected-room.entity';
import { ConnectedUser } from './connected-user/entities/connected-user.entity';
import { RoomsUsers } from './rooms-users/entities/rooms-users.entity';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    CacheModule.registerAsync({
      useClass: CacheService,
    }),
    TypeOrmModule.forRoot({
      ...TYPEORM_MAIN,
      synchronize: NODE_ENV === 'production' ? false : true,
      entities: [User, ConnectedUser, Room, ConnectedRoom, RoomsUsers],
    }),

    UsersModule,
    AuthModule,
    SocketModule,
    RoomModule,
    ConnectedRoomModule,
    ConnectedUserModule,
    RoomsUsersModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}

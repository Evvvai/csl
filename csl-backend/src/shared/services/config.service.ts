import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  DATABASE_DB,
  DATABASE_HOST,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_TYPE,
  DATABASE_USER,
  NODE_ENV,
} from '@environments';
import { SnakeNamingStrategy } from '../strategies/snake-naming.strategy';

// Entity
import { Lobby } from '../../lobbies/entities/lobby.entity';
import { LobbyUser } from '../../lobby-users/entities/lobby-user.entity';
import { ConnectedLobby } from '../../connected-lobby/entities/connected-lobby.entity';
import { User } from '../../users/entities/user.entity';
import { ConnectedUser } from '../../connected-user/entities/connected-user.entity';
import { Room } from '../../room/entities/room.entity';
import { ConnectedRoom } from '../../connected-room/entities/connected-room.entity';
import { RoomsUsers } from '../../rooms-users/entities/rooms-users.entity';
import { FriendsUser } from '../../friends-user/entities/friends-user.entity';

export class ConfigService {
  constructor() {
    /**
     *
     */
  }

  get typeOrmConfig(): TypeOrmModuleOptions {
    const entities = [
      User,
      ConnectedUser,
      Room,
      ConnectedRoom,
      RoomsUsers,
      FriendsUser,
      ConnectedLobby,
      LobbyUser,
      Lobby,
    ];

    return {
      entities,
      keepConnectionAlive: true,
      type: DATABASE_TYPE,
      host: DATABASE_HOST,
      port: DATABASE_PORT,
      username: DATABASE_USER,
      password: DATABASE_PASSWORD,
      database: DATABASE_DB,
      migrationsRun: true,
      synchronize: NODE_ENV === 'production' ? false : true,
      // namingStrategy: new SnakeNamingStrategy(),
      // logging: this.nodeEnv === 'development',
    };
  }
}

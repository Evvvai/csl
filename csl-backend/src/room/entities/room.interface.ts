import { UserI } from 'src/users/entities/user.interface';
import { MaxPlayers } from './max-players.enum';

export interface RoomI {
  id?: number;
  name?: string;
  captainId?: number;
  maxPlayers: MaxPlayers;
  isPrivate?: boolean;
  isSearch?: boolean;
  createdAt?: Date;
  udaptedAt?: Date;

  users?: UserI[];
}

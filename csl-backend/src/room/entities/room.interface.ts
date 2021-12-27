import { UserI } from 'src/users/entities/user.interface';
import { MaxPlayers } from './max-players.enum';
import { StatusRoom } from './status-room';

export interface RoomI {
  id?: number;
  name?: string;
  captainId?: number;
  maxPlayers: MaxPlayers;
  isPublic?: boolean;
  isShare?: boolean;
  status?: StatusRoom;
  createdAt?: Date;
  udaptedAt?: Date;

  users?: UserI[];
}

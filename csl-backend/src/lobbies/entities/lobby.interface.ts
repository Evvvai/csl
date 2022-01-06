import { MaxPlayers } from 'src/room/entities/max-players.enum';
import { UserI } from 'src/users/entities/user.interface';
import { StatusLobby } from './status-lobby';

export interface LobbyI {
  id?: number;
  name?: string;
  firstTeamName?: string;
  secondTeamName?: string;
  captainId?: number;
  maxPlayers: MaxPlayers;
  isPublic?: boolean;
  status?: StatusLobby;
  createdAt?: Date;
  udaptedAt?: Date;

  /////////////////////////////////////////////////////////////////////////////////
  // Relations

  users?: UserI[];
  // connectedLobbies: ConnectedLobby[];
  // lobbiesUsers: LobbyUser[];
}

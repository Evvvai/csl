import { ConnectedLobby } from 'src/connected-lobby/entities/connected-lobby.entity';
import { LobbyUser } from 'src/lobby-users/entities/lobby-user.entity';
import { MaxPlayers } from 'src/room/entities/max-players.enum';
import { StatusLobby } from './status-lobby';

export interface LobbyI {
  id: number;
  name: string;
  firstTeamName: string;
  secondTeamName: string;
  captainId: number;
  maxPlayers: MaxPlayers;
  isPublic: boolean;
  status: StatusLobby;
  createdAt: Date;
  udaptedAt: Date;

  /////////////////////////////////////////////////////////////////////////////////
  // Relations

  // connectedLobbies: ConnectedLobby[];
  // lobbiesUsers: LobbyUser[];
}

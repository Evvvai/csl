import { Lobby } from 'src/lobbies/entities/lobby.entity';
import { User } from 'src/users/entities/user.entity';
import { Teams } from './teams.enum';

export interface LobbyUserI {
  id?: number;
  team: Teams;
  userId: number;
  lobbyId: number;

  /////////////////////////////////////////////////////////////////////////////////
  // Relations

  // user: User;
  // lobby: Lobby;
}

import { User } from '@store'

export interface LobbyState {
  isLoading: boolean

  currentLobby: Lobby
  lobbies: LobbyTeams[]
}

export interface Lobby {
  id: number
  name: string
  captainId: number
  firstTeamName: string
  secondTeamName: string
  maxPlayers: 2 | 3 | 5
  isPublic: boolean
  status: StatusLobby
  createdAt: Date
  udaptedAt: Date
  users: User[]
}

export interface LobbyTeams extends Lobby {
  ctTeam: User[]
  tTeam: User[]
}

export const statusLobby = ['pending', 'searching', 'confirmation'] as const
export type StatusLobby = typeof statusLobby[number]

import { User } from '@store'

export interface LobbyState {
  isLoading: boolean

  currentLobby: Lobby
}

export interface Lobby {
  id: number
  name: string
  captainId: number
  maxPlayers: 2 | 3 | 5
  isPrivate: boolean
  isShare: boolean
  status: StatusLobby
  createdAt: Date
  udaptedAt: Date
  users: User[]
}

export const statusLobby = ['pending', 'searching', 'confirmation'] as const
export type StatusLobby = typeof statusLobby[number]

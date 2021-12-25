import { User } from '@store'

export interface RoomState {
  isLoading: boolean

  currentRoom: Room
}

export interface Room {
  id: number
  name: string
  captainId: number
  maxPlayers: number
  isPrivate: boolean
  isSearch: boolean
  createdAt: Date
  udaptedAt: Date
  users: User[]
}

// export enum MaxPlayers {
//   TWO = 2,
//   THREE = 3,
//   FIVE = 5,
// }

export const maxPlayers = ['TWO', 'THREE', 'FIVE'] as const
export type MaxPlayers = typeof maxPlayers[number]

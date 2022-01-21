import { User } from '@store'

export interface RoomState {
  isLoading: boolean

  currentRoom: Room
}

export interface Room {
  id: number
  name: string
  captainId: number
  maxPlayers: 2 | 3 | 5
  isPrivate: boolean
  isShare: boolean
  status: StatusRoom
  createdAt: Date
  udaptedAt: Date
  users: User[]
}

// export enum MaxPlayers {
//   TWO = 2,
//   THREE = 3,
//   FIVE = 5,
// }

// export enum StatusRoom {
//   PENDING = 'pending',
//   SEARCHING = 'searching',
//   CONFIRMATION = 'confirmation',
// }

export const statusRoom = ['pending', 'searching', 'confirmation'] as const
export type StatusRoom = typeof statusRoom[number]

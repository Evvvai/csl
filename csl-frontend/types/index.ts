export enum Theme {
  default = 'default',
  light = 'light',
  dark = 'dark',
}

export interface GQLErrors {
  error: string
  message: string[]
  statusCode: number
}

export interface GameSettings {
  gameType?: GameType
  maxPlayers: MaxPlayers
}

export const gameType = ['lobby', 'room'] as const
export type GameType = typeof gameType[number]

export const maxPlayers = ['TWO', 'THREE', 'FIVE'] as const
export type MaxPlayers = typeof maxPlayers[number]

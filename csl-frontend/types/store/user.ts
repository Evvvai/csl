export interface UserState {
  isLoggedIn: boolean
  user: User
}

export interface User {
  id: number
  username: string
  steamId64: string
  avatarfull: string
  avatarCustom: string
  dashboard: string
  dateReg: Date
  lastLogin: Date
  role: Role
}

export enum Role {
  USER = 'user',
  PREMIUM = 'premium',
  ADMIN = 'admin',
}

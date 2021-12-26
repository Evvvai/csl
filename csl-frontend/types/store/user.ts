export interface UserState {
  isLoggedIn: boolean
  userInfo: User
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

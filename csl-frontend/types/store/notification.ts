import { Room, User } from '@store'

export interface NotificationState {
  isNotificationLoad: boolean
  isNotificationOpen: boolean

  lobbyInvites: LobbyInvites[]
}

export interface LobbyInvites {
  user: User
  room: Room
  sentAt?: number
  ttl?: number
}

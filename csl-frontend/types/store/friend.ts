import { Room, User } from '@store'

export interface FriendState {
  isFriendLoad: boolean
  isFriendOpen: boolean

  friends: Friend[]
  invitedFriends: User[]
}

export interface Friend extends User {
  online: boolean
  status: StatusFriend
}

export interface StatusFriend {
  room?: Room
  action: '. . .' | 'in looby' | 'search game' | 'playing' | 'sleep'
}

import { Room, User } from '@store'

export interface FriendState {
  isFriendLoad: boolean
  isFriendOpen: boolean

  friends: Friend[]
  filteredFriendsIds: number[]
  invitedFriends: User[]

  term: string
}

export interface Friend extends User {
  online: boolean
  status: StatusFriend
}

export interface StatusFriend {
  room?: Room
  action: '. . .' | 'in looby' | 'search game' | 'playing' | 'sleep'
}

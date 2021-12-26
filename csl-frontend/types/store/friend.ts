import { User } from '@store'

export interface FriendState {
  isFriendLoad: boolean
  isFriendOpen: boolean

  friends: Friend[]
}

export interface Friend extends User {
  status: boolean
}

import { AnyAction } from '@reduxjs/toolkit'
import { Dispatch } from 'react'

// Sockets Actions
import { roomSocket } from './room/room-socket'
import { userSocket } from './user/user-socket'
import { notificationSocket } from './notification/notification-socket'
import { friendSocket } from './friend/friend-socket'

////////////////////////////////////////////////////////////////////////
const SocketsActions: Record<
  string,
  (
    type: string,
    socket: any,
    payload: any,
    dispatch: Dispatch<AnyAction>
  ) => void
> = {
  room: roomSocket,
  user: userSocket,
  friend: friendSocket,
  notification: notificationSocket,
}

export default SocketsActions

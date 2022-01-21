import { AnyAction } from '@reduxjs/toolkit'
import { Dispatch } from 'react'

import { LobbyInvites } from '@store'

// Friend On
export const friendSocketOn = (socket: any, dispatch: Dispatch<AnyAction>) => {
  socket.on('friend/load', (friends: any) => {
    dispatch({
      type: 'friend/loadFriends',
      payload: friends,
    })
  })
  socket.on('friend/online', (friendId: number) => {
    dispatch({
      type: 'friend/friendOnline',
      payload: friendId,
    })
    console.log('friendOnline')
  })
  socket.on('friend/offline', (friendId: number) => {
    dispatch({
      type: 'friend/friendOffline',
      payload: friendId,
    })
    console.log('friendOffline')
  })
  socket.on('friend/declineInvite', (invite: LobbyInvites) => {
    console.log('socket.on | friend/declineInvite', invite)
    dispatch({
      type: 'friend/removedInvite',
      payload: invite,
    })
  })
}

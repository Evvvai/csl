import { AnyAction } from '@reduxjs/toolkit'
import { Dispatch } from 'react'

import { LobbyInvites } from '@store'

// Notification On
export const notificationSocketOn = (
  socket: any,
  dispatch: Dispatch<AnyAction>
) => {
  socket.on('notification/invite', (invite: LobbyInvites) => {
    dispatch({
      type: 'notification/newInvite',
      payload: invite,
    })
  })
  socket.on('notification/removeUserInvite', (invite: LobbyInvites) => {
    console.log('socket.on | notification/removeUserInvite', invite)
    dispatch({
      type: 'notification/removeUserInvite',
      payload: invite,
    })
  })
  // socket.on('removeRoomInvite', (invite: LobbyInvites) => {
  //   dispatch({
  //     type: 'notification/removeRoomInvite',
  //     payload: invite,
  //   })
  // })
}

import { AnyAction } from '@reduxjs/toolkit'
import { Dispatch } from 'react'

import { LobbyInvites, Room, User } from '@store'

// Sync On
export const syncSocketOn = (socket: any, dispatch: Dispatch<AnyAction>) => {
  socket.on('sync', (socketIds: any) => {
    socket.emit('sync', socketIds)
  })
  socket.on('sync/roomCreated', (room: Room) => {
    dispatch({
      type: 'room/syncRoom',
      payload: room,
    })
  })
  socket.on('sync/joinRoom', (room: Room) => {
    dispatch({
      type: 'room/syncRoom',
      payload: room,
    })
  })
  socket.on('sync/leaveRoom', () => {
    dispatch({
      type: 'room/syncRoom',
      payload: [],
    })
  })
  socket.on('error', (Exception: any) => {
    console.log('Connected')
  })
}

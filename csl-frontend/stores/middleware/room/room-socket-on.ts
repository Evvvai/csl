import { AnyAction } from '@reduxjs/toolkit'
import { Dispatch } from 'react'

import { LobbyInvites, Room, User } from '@store'

// Room On
export const roomSocketOn = (socket: any, dispatch: Dispatch<AnyAction>) => {
  socket.on('room/deleted', (room: Room) => {
    console.log('socket.on | room/deleted')
    dispatch({
      type: 'room/deletedRoom',
      payload: room,
    })
  })
  socket.on('room/joinRoom', (room: Room) => {
    dispatch({
      type: 'room/syncRoom',
      payload: room,
    })
  })
  socket.on('room/userJoin', (user: User) => {
    console.log('socket.on | room/userJoin', user)

    // DANGEROUS
    dispatch({
      type: 'friend/removedInvite',
      payload: { user: user } as LobbyInvites,
    })
    dispatch({
      type: 'room/addUser',
      payload: user,
    })
  })
  socket.on('room/userLeave', (user: User) => {
    console.log('socket.on | room/userLeave', user)
    dispatch({
      type: 'room/removeUser',
      payload: user,
    })
  })
}

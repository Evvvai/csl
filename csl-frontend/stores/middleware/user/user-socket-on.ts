import { AnyAction } from '@reduxjs/toolkit'
import { Dispatch } from 'react'

import { LobbyInvites, Room, User } from '@store'

// User On
export const userSocketOn = (socket: any, dispatch: Dispatch<AnyAction>) => {
  // Update the online users list every time a user logs in or out
  // socket.on('users online', (onlineUsers: any) => {
  //   console.log('users online', onlineUsers)
  //   // dispatch()
  // })
  socket.on('connected', (data: any) => {
    console.log('Connected')
  })
}
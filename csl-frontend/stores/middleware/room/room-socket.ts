import { AnyAction } from '@reduxjs/toolkit'
import { Dispatch } from 'react'

// Room
export const roomSocket = (
  type: string,
  socket: any,
  payload: any,
  dispatch: Dispatch<AnyAction>
) => {
  switch (type) {
    // User
    case 'createdRoom': {
      socket.emit('createRoom', payload)
      break
    }

    case 'leavedRoom': {
      console.log('leavedRoom', payload)
      socket.emit('leaveRoom', payload)
      break
    }

    case 'deletedRoom': {
      // Idk were better here or in hook
      // socket.emit('deleteRoom', payload)
      break
    }

    case 'activedRoom': {
      socket.emit('reConnectRoom', payload)
      break
    }

    case 'sendedInvite': {
      socket.emit('sendedInvite', payload)
      break
    }
  }
}

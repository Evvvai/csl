import { LobbyInvites, Room, User } from '@store'
import { Dispatch } from 'redux'
import { RootState } from 'stores/rootReducer'

// Interface
interface SocketMiddlewareParams {
  dispatch: Dispatch
  getState: () => RootState
}

// Middleware
///////////////////////////////////////////////////////////////////////////////////////////////////////////
const socketMiddleware = (socket: any) => {
  return (params: SocketMiddlewareParams) => (next: any) => (action: any) => {
    const { dispatch } = params
    const { type, payload } = action

    // Init
    // if (type === 'app/appLoaded') {
    if (type === 'user/setUserSetting') {
      socket.connect()

      userSocketOn(socket, dispatch)
      roomSocketOn(socket, dispatch)
      friendSocketOn(socket, dispatch)
      notificationSocketOn(socket, dispatch)
      syncSocketOn(socket, dispatch)

      return next(action)
    }

    // Split actions
    const actions = type.split('/')

    switch (actions[0]) {
      // User
      case 'user': {
        userSocket(actions[1], socket, payload, dispatch)
        break
      }

      // Room
      case 'room': {
        roomSocket(actions[1], socket, payload, dispatch)
        break
      }

      // Friend
      case 'friend': {
        friendSocket(actions[1], socket, payload, dispatch)
        break
      }

      // Notifictaion
      case 'notification': {
        notificationSocket(actions[1], socket, payload, dispatch)
        break
      }
    }

    return next(action)
  }
}

export default socketMiddleware

// User
const userSocket = (type: string, socket: any, payload: any, dispatch: any) => {
  switch (type) {
    // User
    case '...': {
      break
    }
  }
}

const userSocketOn = (socket: any, dispatch: any) => {
  // Update the online users list every time a user logs in or out
  // socket.on('users online', (onlineUsers: any) => {
  //   console.log('users online', onlineUsers)
  //   // dispatch()
  // })

  socket.on('connected', (data: any) => {
    console.log('Connected')
  })
}

// Room
const roomSocket = (type: string, socket: any, payload: any, dispatch: any) => {
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
      socket.emit('deleteRoom', payload)
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

const roomSocketOn = (socket: any, dispatch: any) => {
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

// Friend
const friendSocket = (
  type: string,
  socket: any,
  payload: any,
  dispatch: any
) => {
  switch (type) {
    // User
    case 'sendedInvite': {
      socket.emit('sentInvite', payload)
      break
    }
    case 'removedInvite': {
      socket.emit('removeInvite', payload)
      break
    }
  }
}

const friendSocketOn = (socket: any, dispatch: any) => {
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

// Notification
const notificationSocket = (
  type: string,
  socket: any,
  payload: any,
  dispatch: any
) => {
  switch (type) {
    case 'acceptedInvite': {
      socket.emit('joinRoom', payload.room)
      break
    }
    case 'declinedInvite': {
      socket.emit('declineInvite', payload)
      break
    }
  }
}

const notificationSocketOn = (socket: any, dispatch: any) => {
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

// Cringe but I think this is the surest way to synchronize the sessions
const syncSocketOn = (socket: any, dispatch: any) => {
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

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
    if (type === 'user/setUserSetting') {
      socket.connect()

      userSocketOn(socket, dispatch)
      roomSocketOn(socket, dispatch)
      friendSocketOn(socket, dispatch)
      syncSocketOn(socket)

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
  socket.on('users online', (onlineUsers: any) => {
    console.log('users online', onlineUsers)
    // dispatch()
  })

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
      socket.emit('leaveRoom', payload)
      break
    }

    case 'deletedRoom': {
      socket.emit('deleteRoom', payload)
      break
    }

    case 'activedRoom': {
      socket.emit('activedRoom', payload)
      break
    }
  }
}

const roomSocketOn = (socket: any, dispatch: any) => {
  socket.on('roomDeleted', (room: any) => {
    dispatch({
      type: 'room/deletedRoom',
      payload: room,
    })
  })

  socket.on('syncRoomCreated', (room: any) => {
    dispatch({
      type: 'room/syncRoom',
      payload: room,
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
    case '...': {
      socket.emit('...', payload)
      break
    }
  }
}

const friendSocketOn = (socket: any, dispatch: any) => {
  socket.on('loadFriends', (friends: any) => {
    dispatch({
      type: 'friend/loadFriends',
      payload: friends,
    })
  })

  socket.on('friendOnline', (friendId: number) => {
    dispatch({
      type: 'friend/friendOnline',
      payload: friendId,
    })
    console.log('friendOnline')
  })

  socket.on('friendOffline', (friendId: number) => {
    dispatch({
      type: 'friend/friendOffline',
      payload: friendId,
    })
    console.log('friendOffline')
  })
}

// Cringe but I think this is the surest way to synchronize the sessions
const syncSocketOn = (socket: any) => {
  socket.on('sync', (socketIds: any) => {
    socket.emit('sync', socketIds)
  })
  socket.on('error', (Exception: any) => {
    console.log('Connected')
  })
}

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LobbyInvites, NotificationState, Room } from '@store'
import { HYDRATE } from 'next-redux-wrapper'

const initialState: NotificationState = {
  isNotificationLoad: false,
  isNotificationOpen: false,

  lobbyInvites: [],
}

// Slice
////////////////////////////////////////////////////////////////////////
const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    openNotification: (state) => {
      state.isNotificationOpen = true
    },
    closeNotification: (state) => {
      state.isNotificationOpen = false
    },
    newInvite: (state, { payload }: PayloadAction<LobbyInvites>) => {
      payload.sentAt = +new Date()
      state.lobbyInvites.push(payload)
    },
    removeUserInvite: (state, { payload }: PayloadAction<LobbyInvites>) => {
      state.lobbyInvites = state.lobbyInvites.filter((invite) => {
        return !(
          invite.user.id === payload.user.id &&
          invite.room.id === payload.room.id
        )
      })
    },
    // removeRoomInvite: (state, { payload }: PayloadAction<LobbyInvites>) => {
    //   state.lobbyInvites = state.lobbyInvites.filter(
    //     (invite) => invite.room.id !== payload.room.id
    //   )
    // },
    // loadNotifications: (state, { payload }: PayloadAction<Friend[]>) => {
    //   state.isFriendLoad = true
    //   state.friends = payload
    // },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload,
      }
    },
  },
})

// export const {} = friendSlice.actions
export default notificationSlice

// Action

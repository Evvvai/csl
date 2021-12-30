import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Friend, FriendState, LobbyInvites, Room, User } from '@store'
import { HYDRATE } from 'next-redux-wrapper'

const initialState: FriendState = {
  isFriendLoad: false,
  isFriendOpen: false,

  friends: [],
  invitedFriends: [],
}

// Slice
////////////////////////////////////////////////////////////////////////
const friendSlice = createSlice({
  name: 'friend',
  initialState,
  reducers: {
    openFriend: (state) => {
      state.isFriendOpen = true
    },
    closeFriend: (state) => {
      state.isFriendOpen = false
    },
    loadFriends: (state, { payload }: PayloadAction<Friend[]>) => {
      state.isFriendLoad = true
      state.friends = payload
    },
    updatedFriends: (state, { payload }: PayloadAction<Friend[]>) => {
      state.friends = [...state.friends, ...payload]
    },
    friendOnline: (state, { payload }: PayloadAction<number>) => {
      state.friends = state.friends.map((val) => {
        if (val.id === payload) val.online = true
        return val
      })
    },
    friendOffline: (state, { payload }: PayloadAction<number>) => {
      state.friends = state.friends.map((val) => {
        if (val.id === payload) {
          val.online = false
          val.lastLogin = new Date()
        }
        return val
      })
    },
    sendedInvite: (state, { payload }: PayloadAction<LobbyInvites>) => {
      state.invitedFriends.push(payload.user)
    },
    removedInvite: (state, { payload }: PayloadAction<LobbyInvites>) => {
      state.invitedFriends = state.invitedFriends.filter(
        (invite) => invite.id !== payload?.user.id
      )
    },
    // syncRemoveInvite: (state, { payload }: PayloadAction<LobbyInvites>) => {
    //   state.invitedFriends = state.invitedFriends.filter(
    //     (invite) => invite.id !== payload.user.id
    //   )
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
export default friendSlice

// Action

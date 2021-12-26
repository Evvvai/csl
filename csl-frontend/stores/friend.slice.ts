import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Friend, FriendState, User } from '@store'
import { HYDRATE } from 'next-redux-wrapper'

const initialState: FriendState = {
  isFriendLoad: false,
  isFriendOpen: false,

  friends: [],
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
        if (val.id === payload) val.status = true
        return val
      })
    },
    friendOffline: (state, { payload }: PayloadAction<number>) => {
      state.friends = state.friends.map((val) => {
        if (val.id === payload) val.status = false
        return val
      })
    },
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

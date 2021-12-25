import { createSlice } from '@reduxjs/toolkit'
import { AppState } from '@store'
import { HYDRATE } from 'next-redux-wrapper'

const initialState: AppState = {
  isLoad: false,

  isFriendOpen: false,
  isMenuOpen: false,
}

// Slice
////////////////////////////////////////////////////////////////////////
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    appLoaded: (state) => {
      state.isLoad = true
    },
    openMenu: (state) => {
      state.isMenuOpen = true
    },
    closeMenu: (state) => {
      state.isMenuOpen = false
    },
    openFriend: (state) => {
      state.isFriendOpen = true
    },
    closeFriend: (state) => {
      state.isFriendOpen = false
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.isLoad,
      }
    },
  },
})

export const { appLoaded } = appSlice.actions
export default appSlice

// Action

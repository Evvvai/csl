import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Lobby, LobbyState, User } from '@store'
import { HYDRATE } from 'next-redux-wrapper'

const initialState: LobbyState = {
  isLoading: false,

  currentLobby: {} as Lobby,
}

// Slice
////////////////////////////////////////////////////////////////////////
const lobbySlice = createSlice({
  name: 'lobby',
  initialState,
  reducers: {
    setLoading: (state) => {
      state.isLoading = true
    },
    createdLobby: (state, { payload }: PayloadAction<Lobby>) => {
      state.currentLobby = payload
      state.isLoading = false
    },
    leavedLobby: (state, { payload }: PayloadAction<Lobby>) => {
      state.currentLobby = {} as Lobby
    },
    deletedLobby: (state, { payload }: PayloadAction<Lobby>) => {
      state.currentLobby = {} as Lobby
    },
    activedLobby: (state, { payload }: PayloadAction<Lobby>) => {
      state.currentLobby = payload
    },
    syncLobby: (state, { payload }: PayloadAction<Lobby>) => {
      state.currentLobby = payload
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.lobby,
      }
    },
  },
})

// export const {  } = lobbySlice.actions
export default lobbySlice

// Action

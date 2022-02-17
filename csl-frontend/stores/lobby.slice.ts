import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Lobby, LobbyState, LobbyTeams, User } from '@store'
import { HYDRATE } from 'next-redux-wrapper'

const initialState: LobbyState = {
  isLoading: false,

  currentLobby: {} as Lobby,
  lobbies: [],
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
    setLobbies: (state, { payload }: PayloadAction<LobbyTeams[]>) => {
      state.isLoading = false
      state.lobbies = payload
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

export const { setLobbies } = lobbySlice.actions
export default lobbySlice

// Action

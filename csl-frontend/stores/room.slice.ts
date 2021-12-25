import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Room, RoomState } from '@store'
import { HYDRATE } from 'next-redux-wrapper'

const initialState: RoomState = {
  isLoading: false,

  currentRoom: {} as Room,
}

// Slice
////////////////////////////////////////////////////////////////////////
const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setLoading: (state) => {
      state.isLoading = true
    },
    createdRoom: (state, { payload }: PayloadAction<Room>) => {
      state.currentRoom = payload
      state.isLoading = false
    },
    leavedRoom: (state, { payload }: PayloadAction<Room>) => {
      state.currentRoom = {} as Room
      state.isLoading = false
    },
    deletedRoom: (state, { payload }: PayloadAction<Room>) => {
      state.currentRoom = {} as Room
      state.isLoading = false
    },
    activedRoom: (state, { payload }: PayloadAction<Room>) => {
      state.currentRoom = payload
      state.isLoading = false
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

// export const {  } = roomSlice.actions
export default roomSlice

// Action

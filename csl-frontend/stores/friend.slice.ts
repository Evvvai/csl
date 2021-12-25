import { createSlice } from '@reduxjs/toolkit'
import { FriendState } from '@store'
import { HYDRATE } from 'next-redux-wrapper'

const initialState: FriendState = {
  isLoad: false,
}

// Slice
////////////////////////////////////////////////////////////////////////
const friendSlice = createSlice({
  name: 'friend',
  initialState,
  reducers: {},
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

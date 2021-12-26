import { createSlice, PayloadAction, Dispatch } from '@reduxjs/toolkit'
import { browserStorage } from 'utils/browser'
import { HYDRATE } from 'next-redux-wrapper'
import { User, UserState } from '@store'

const initialState: UserState = {
  isLoggedIn: false,
  userInfo: {} as User,
}

// Slice
////////////////////////////////////////////////////////////////////////
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserSetting: (state, { payload }: PayloadAction<User>) => {
      state.isLoggedIn = true
      state.userInfo = payload
    },
    removeUserSetting: (state) => {
      browserStorage.removeItem('jwt')
      state.isLoggedIn = false
      state.userInfo = {} as User
    },
    setDashboard: (state, { payload }: PayloadAction<string>) => {
      state.userInfo.dashboard = payload
    },
    setAvatar: (state, { payload }: PayloadAction<string>) => {
      state.userInfo.avatarCustom = payload
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.userInfo,
      }
    },
  },
})

export const { setUserSetting } = userSlice.actions
export default userSlice

// Action
///////////////////////////////////////////////////////////////////////////////////////////////////

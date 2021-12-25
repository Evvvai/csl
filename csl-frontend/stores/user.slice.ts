import { createSlice, PayloadAction, Dispatch } from '@reduxjs/toolkit'
import { User, UserState } from 'types/store/user/user'
import { browserStorage } from 'utils/browser'
import { HYDRATE } from 'next-redux-wrapper'

const initialState: UserState = {
  isLoggedIn: false,
  user: {} as User,
}

// Slice
////////////////////////////////////////////////////////////////////////
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserSetting: (state, { payload }: PayloadAction<User>) => {
      state.isLoggedIn = true
      state.user = payload
    },
    removeUserSetting: (state) => {
      browserStorage.removeItem('jwt')
      state.isLoggedIn = false
      state.user = {} as User
    },
    setDashboard: (state, { payload }: PayloadAction<string>) => {
      state.user.dashboard = payload
    },
    setAvatar: (state, { payload }: PayloadAction<string>) => {
      state.user.avatarCustom = payload
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.user,
      }
    },
  },
})

export const { setUserSetting } = userSlice.actions
export default userSlice

// Action
///////////////////////////////////////////////////////////////////////////////////////////////////

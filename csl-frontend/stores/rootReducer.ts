import { combineReducers } from 'redux'

// Import slices
import appSlice from './app.slice'
import userSlice from './user.slice'
import roomSlice from './room.slice'
import friendSlice from './friend.slice'
import notificationSlice from './notification.slice'

// Combine
export const rootReducer = combineReducers({
  [appSlice.name]: appSlice.reducer,
  [userSlice.name]: userSlice.reducer,
  [roomSlice.name]: roomSlice.reducer,
  [friendSlice.name]: friendSlice.reducer,
  [notificationSlice.name]: notificationSlice.reducer,
})

export type RootState = ReturnType<typeof rootReducer>

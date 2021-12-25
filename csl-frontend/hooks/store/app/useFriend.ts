import ActionCreators from '../../../stores/app.slice'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { useTypesSelector } from '../useTypesSelector'

// Application Hook Selector / Dispatch
////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const useFriend = () => {
  const dispatch = useDispatch()
  const { openFriend, closeFriend } = bindActionCreators(
    ActionCreators.actions,
    dispatch
  )
  const { isFriendOpen } = useTypesSelector((state) => state.app)

  return { isFriendOpen, openFriend, closeFriend }
}

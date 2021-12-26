import ActionCreators from '../../../stores/friend.slice'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { useTypesSelector } from '../useTypesSelector'
import { useCallback, useMemo } from 'react'
import { clientHandle } from '../../../utils/graphql/index'
import { USER_NEW_FRIENDS } from 'types/graphql/mutation'

// Friend Hook Selector / Dispatch
////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const useFriend = () => {
  const dispatch = useDispatch()
  const { openFriend, closeFriend, updatedFriends } = bindActionCreators(
    ActionCreators.actions,
    dispatch
  )
  const { isFriendOpen, friends, isFriendLoad } = useTypesSelector(
    (state) => state.friend
  )

  const updateFriends = useCallback(async () => {
    const { data, errors } = await clientHandle(USER_NEW_FRIENDS, {})

    if (data) updatedFriends(data.userNewFriends)
    // Must be create sync callback
  }, [])

  return {
    isFriendOpen,
    openFriend,
    closeFriend,
    updateFriends,
    friendsList: friends,
    isFriendLoad,
  }
}

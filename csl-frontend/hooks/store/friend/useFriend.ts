import ActionCreators from '../../../stores/friend.slice'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { useTypesSelector } from '../useTypesSelector'
import { useCallback, useMemo } from 'react'
import { clientHandle } from '../../../utils/graphql/index'
import { USER_NEW_FRIENDS } from 'types/graphql/mutation'
import { Room, User } from '@store'

// Friend Hook Selector / Dispatch
////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const useFriend = () => {
  const dispatch = useDispatch()
  const {
    openFriend,
    closeFriend,
    updatedFriends,
    sendedInvite,
    removedInvite,
  } = bindActionCreators(ActionCreators.actions, dispatch)
  const { isFriendOpen, friends, isFriendLoad, invitedFriends } =
    useTypesSelector((state) => state.friend)

  const updateFriends = useCallback(async () => {
    const { data, errors } = await clientHandle(USER_NEW_FRIENDS, {})

    if (data) updatedFriends(data.userNewFriends)
    // Must be create sync callback
  }, [])

  const sentInvite = useCallback(async (user: User, room: Room) => {
    if (room.users.length === room.maxPlayers) return
    sendedInvite({ user, room })
  }, [])

  const removeInvite = useCallback(async (user: User, room: Room) => {
    removedInvite({ user, room })
  }, [])

  return {
    isFriendOpen,
    openFriend,
    closeFriend,
    updateFriends,
    friendsList: friends,
    isFriendLoad,
    sentInvite,
    removeInvite,
    invitedFriends,
  }
}

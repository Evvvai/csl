import ActionCreators from '../../../stores/notification.slice'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { useTypesSelector } from '../useTypesSelector'
import { useCallback, useMemo } from 'react'
import { clientHandle } from '../../../utils/graphql/index'
import { LobbyInvites } from '@store'

// Notification Hook Selector / Dispatch
////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const useNotification = () => {
  const dispatch = useDispatch()
  const { openNotification, closeNotification, removeUserInvite } =
    bindActionCreators(ActionCreators.actions, dispatch)
  const { isNotificationLoad, isNotificationOpen, lobbyInvites } =
    useTypesSelector((state) => state.notification)

  const acceptInvite = useCallback(async (invite: LobbyInvites) => {
    dispatch({ type: 'notification/acceptedInvite', payload: invite })
    removeUserInvite(invite)
  }, [])

  const declineInvite = useCallback(async (invite: LobbyInvites) => {
    dispatch({ type: 'notification/declinedInvite', payload: invite })
    removeUserInvite(invite)
  }, [])

  return {
    openNotification,
    closeNotification,
    isNotificationLoad,
    isNotificationOpen,
    lobbyInvites,
    acceptInvite,
    declineInvite,
  }
}

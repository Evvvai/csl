import ActionCreatorsApp from '../../../stores/app.slice'
import ActionCreatorsRoom from '../../../stores/room.slice'
import ActionCreatorsLobby from '../../../stores/lobby.slice'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { useTypesSelector } from '../useTypesSelector'
import { useCallback } from 'react'
import { clientHandle } from 'utils/graphql'
import { ACTIVE_LOBBY, ACTIVE_ROOM } from 'types/graphql/quary'
import { AUTH } from 'types/graphql/mutation'

// Application Hook Selector / Dispatch
////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const useApp = () => {
  const dispatch = useDispatch()
  const { openMenu, closeMenu, appLoaded } = bindActionCreators(
    ActionCreatorsApp.actions,
    dispatch
  )
  const { activedRoom } = bindActionCreators(
    ActionCreatorsRoom.actions,
    dispatch
  )
  const { activedLobby } = bindActionCreators(
    ActionCreatorsLobby.actions,
    dispatch
  )
  const { isLoad, isMenuOpen } = useTypesSelector((state) => state.app)

  const appLoad = useCallback(async () => {
    const [room, roomErrors] = await clientHandle(ACTIVE_ROOM, {})

    if (room && !roomErrors) activedRoom(room)
    else {
      const [lobby, lobbyErrors] = await clientHandle(ACTIVE_LOBBY, {})
      if (lobby && !lobbyErrors) activedLobby(lobby)
    }

    appLoaded()
  }, [])

  return { isLoad, appLoad, isMenuOpen, openMenu, closeMenu }
}

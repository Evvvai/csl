import ActionCreatorsApp from '../../../stores/app.slice'
import ActionCreatorsRoom from '../../../stores/room.slice'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { useTypesSelector } from '../useTypesSelector'
import { useCallback } from 'react'
import { clientHandle } from 'utils/graphql'
import { ACTIVE_ROOM } from 'types/graphql/quary'
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
  const { isLoad, isMenuOpen } = useTypesSelector((state) => state.app)

  const appLoad = useCallback(async () => {
    const { data, errors } = await clientHandle(ACTIVE_ROOM, {})

    console.log('data', data)

    if (data && !errors) activedRoom(data.activeRoom)

    appLoaded()
  }, [])

  return { isLoad, appLoad, isMenuOpen, openMenu, closeMenu }
}

import ActionCreators from '../../../stores/lobby.slice'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { useTypesSelector } from '../useTypesSelector'
import { useCallback } from 'react'
import { clientHandle } from 'utils/graphql'
import { CREATE_LOBBY } from 'types/graphql/mutation'
import { Lobby, MaxPlayers } from '@store'
import { socket } from 'stores'

// Lobby Hook Selector / Dispatch
////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const useLobby = () => {
  const dispatch = useDispatch()
  const { setLoading, createdLobby, leavedLobby, deletedLobby } =
    bindActionCreators(ActionCreators.actions, dispatch)
  const { isLoading, currentLobby } = useTypesSelector((state) => state.lobby)

  const createLobby = useCallback(async (maxPlayers: MaxPlayers) => {
    setLoading()

    const [data, errors] = await clientHandle(CREATE_LOBBY, {
      maxPlayers: maxPlayers,
    })

    createdLobby(data)
  }, [])

  const leaveLobby = useCallback(async (lobby: Lobby) => {
    leavedLobby(lobby)
  }, [])

  const deleteLobby = useCallback(async (lobby: Lobby) => {
    setLoading()

    socket.emit('deleteLobby', lobby)
    deletedLobby(lobby)
  }, [])

  return { isLoading, currentLobby, createLobby, leaveLobby, deleteLobby }
}

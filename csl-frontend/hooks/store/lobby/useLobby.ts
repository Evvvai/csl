import ActionCreators from '../../../stores/lobby.slice'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { useTypesSelector } from '../useTypesSelector'
import { useCallback } from 'react'
import { clientHandle } from 'utils/graphql'
import { CREATE_LOBBY } from 'types/graphql/mutation'
import { Lobby } from '@store'
import { socket } from 'stores'
import { GameSettings } from '@types'

// Lobby Hook Selector / Dispatch
////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const useLobby = () => {
  const dispatch = useDispatch()
  const { setLoading, createdLobby, leavedLobby, deletedLobby } =
    bindActionCreators(ActionCreators.actions, dispatch)
  const { isLoading, currentLobby, lobbies } = useTypesSelector(
    (state) => state.lobby
  )

  const createLobby = useCallback(async (options: GameSettings) => {
    setLoading()

    const [data, errors] = await clientHandle(CREATE_LOBBY, {
      maxPlayers: options.maxPlayers,
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

  return {
    isLoading,
    currentLobby,
    createLobby,
    leaveLobby,
    deleteLobby,
    lobbies,
  }
}

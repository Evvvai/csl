import ActionCreators from '../../../stores/room.slice'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { useTypesSelector } from '../useTypesSelector'
import { useCallback } from 'react'
import { clientHandle } from 'utils/graphql'
import { CREATE_ROOM, DELETE_ROOM } from 'types/graphql/mutation'
import { MaxPlayers, Room } from '@store'

// Room Hook Selector / Dispatch
////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const useRoom = () => {
  const dispatch = useDispatch()
  const { setLoading, createdRoom, leavedRoom, deletedRoom } =
    bindActionCreators(ActionCreators.actions, dispatch)
  const { isLoading, currentRoom } = useTypesSelector((state) => state.room)

  const createRoom = useCallback(async (maxPlayers: MaxPlayers) => {
    setLoading()

    const { data, errors } = await clientHandle(CREATE_ROOM, {
      maxPlayers: maxPlayers,
    })

    createdRoom(data.createRoom)
  }, [])

  const leaveRoom = useCallback(async (room: Room) => {
    // setLoading()
    // const { data, errors } = await clientHandle(CREATE_ROOM, {
    //   maxPlayers: maxPlayers,
    // })
    // createdRoom(data.createRoom)
  }, [])

  const deleteRoom = useCallback(async (room: Room) => {
    setLoading()

    // const { data, errors } = await clientHandle(DELETE_ROOM, {})

    deletedRoom(room)
  }, [])

  return { isLoading, currentRoom, createRoom, leaveRoom, deleteRoom }
}
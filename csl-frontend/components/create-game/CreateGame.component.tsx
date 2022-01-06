import React, { FC, Fragment, useState } from 'react'

// Styles
import styles from './CreateGame.module.scss'
import { useUser } from '../../hooks/store/user/useUser'
const {
  createGame,
  createGameContent,
  create,
  moveFriend,
  mode,
  modeActive,
  type,
  typeActive,
} = styles

// Icons
import { GiAbstract061 } from 'react-icons/gi'
import { GrMore } from 'react-icons/gr'
import { BiGridVertical } from 'react-icons/bi'

// Components

// Custom hooks
import { useFriend } from 'hooks/store/friend'
import { useRoom } from 'hooks/store/room'
import { useLobby } from 'hooks/store/lobby'

// Utils
import cn from 'classnames'
import { MaxPlayers } from '@store'
import { useRouter } from 'next/dist/client/router'

type GameType = 'lobby' | 'room'

interface Props {}

///////////////////////////////////////////////////////////////////////////////////////////
const CreateGame: FC<Props> = (props) => {
  const { currentRoom, createRoom } = useRoom()
  const { currentLobby, createLobby } = useLobby()
  const { isFriendOpen } = useFriend()
  const { isLoggedIn } = useUser()

  const router = useRouter()

  const [generateStage, setGenerateStage] = useState<0 | 1 | 2>(0)
  const [isSelectType, setIsSelectType] = useState<GameType | null>(null)

  const handleClickGenerate = () => {
    if (generateStage) setGenerateStage(0)
    else setGenerateStage(1)
  }
  const handleClickSelectType = (type: GameType) => () => {
    setIsSelectType(type)
    setGenerateStage(2)
  }
  const handleClickSelectMode = (maxPlayers: MaxPlayers) => async () => {
    if (!isLoggedIn) {
      router.push(process.env.NEXT_BACKEND_URL + '/auth/steam')
      return
    }
    isSelectType === 'room' ? createRoom(maxPlayers) : createLobby(maxPlayers)
    setGenerateStage(0)
  }

  // if (currentRoom?.id === undefined && currentLobby?.id === undefined) {
  return (
    <div className={cn(createGame, { [moveFriend]: isFriendOpen })}>
      <div className={createGameContent}>
        <div onClick={handleClickGenerate} className={create}>
          <GiAbstract061 />
        </div>
        <div className={cn(type, { [typeActive]: generateStage === 1 })}>
          <span onClick={handleClickSelectType('lobby')}>
            <BiGridVertical />
          </span>
          <span onClick={handleClickSelectType('room')}>
            <GrMore />
          </span>
        </div>
        <div className={cn(mode, { [modeActive]: generateStage === 2 })}>
          <span onClick={handleClickSelectMode('TWO')}>x2</span>
          <span onClick={handleClickSelectMode('THREE')}>x3</span>
          <span onClick={handleClickSelectMode('FIVE')}>x5</span>
        </div>
      </div>
    </div>
  )
  // }
}

export default CreateGame

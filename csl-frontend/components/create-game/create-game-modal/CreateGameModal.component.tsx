import React, { FC, useState } from 'react'
import cn from 'classnames'

// Styles
import styles from './CreateGameModal.module.scss'
const {
  formContent,
  formInner,
  moduleHeader,
  moduleHeaderTitle,
  moduleHeaderClose,
  moduleSubmit,
  moduleSubmitAgree,
  moduleInfo,
  hrH,
  moduleContent,
  moduleList,
  moduleItem,
  moduleItemImg,
  moduleItemInfo,
  moduleItemNone,
  moduleItemLoading,
  moduleClose,
} = styles

// Icons
import { IoIosClose } from 'react-icons/io'

// Components

// Custom Hooks
import { useRoom } from 'hooks/store/room'
import { useLobby } from 'hooks/store/lobby'

// Utils
import { GameType, MaxPlayers } from '@types'

// Interface
interface Props {
  gameType: GameType

  close?: any
  isOpen?: any
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export default function CreateGameModal(props: Props): JSX.Element {
  const { currentRoom, createRoom } = useRoom()
  const { currentLobby, createLobby } = useLobby()

  const handleCreateGame = (maxPlayers: MaxPlayers) => (e: any) => {
    if (!currentRoom?.id && !currentLobby?.id) {
      props.gameType === 'room'
        ? createRoom({ maxPlayers })
        : createLobby({ maxPlayers })
    }
    props.close()
  }

  return (
    <form
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
      }}
      className={formContent}
    >
      <section className={formInner}>
        <div className={moduleHeader}>
          <div className={moduleHeaderTitle}>
            Select the number of players for the {props.gameType}
          </div>
        </div>
        <hr className={hrH} />

        <div className={moduleContent}>
          <button onClick={handleCreateGame('TWO')} className={moduleSubmit}>
            TWO
          </button>
          <button onClick={handleCreateGame('THREE')} className={moduleSubmit}>
            THREE
          </button>
          <button onClick={handleCreateGame('FIVE')} className={moduleSubmit}>
            FIVE
          </button>
        </div>
      </section>
      <div className={moduleClose} onClick={props.close}>
        <IoIosClose />
      </div>
    </form>
  )
}

import { FC, Fragment, useEffect, useMemo, useState } from 'react'

// Styles
import styles from '../../styles/layouts/Layouts.module.scss'

// Icons
import { AiOutlineAppstoreAdd } from 'react-icons/ai'

// Component
import Modal from '../UI/Modal/Modal.component'
import { Portal } from 'utils/portal'

// Custom hooks
import { useRouter } from 'next/dist/client/router'
import { useRoom } from 'hooks/store/room'
import { useLobby } from 'hooks/store/lobby'

// Utils
import CreateGameModal from '../create-game/create-game-modal/CreateGameModal.component'
import { gameType, GameType } from '@types'

//////////////////////////////////////////////////////////////////////////////////////
const GamePath: FC = ({ children }) => {
  const router = useRouter()

  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false)
  const [section, setSection] = useState<number | undefined>(undefined)

  const validateCreateGame = useMemo((): GameType | null => {
    const validCreateGameSection = Object.keys(ValidCreateGameSection)

    const key =
      Object.keys(GameSection).find((key) => {
        if (
          GameSection[key] === section &&
          validCreateGameSection.includes(key)
        )
          return key
      }) || null

    if (key) return ValidCreateGameSection[key]
    else return null
  }, [section])

  useEffect(() => {
    if (router.pathname.includes('game'))
      setSection(GameSection[router.pathname.split('/')[2]])
    else {
      if (section !== undefined) setSection(undefined)
    }
  }, [router.pathname])

  if (section !== undefined)
    return (
      <div>
        <div className={styles.layoutsGameTitle}>
          <h1>Game</h1>
        </div>
        <div className={styles.layoutsGameVarious}>
          <span style={{ transform: 'translateX(' + 100 * section + 'px)' }} />
          <button
            className={styles.layoutsGameVariousItem}
            onClick={(e) => router.push('/game/lobbies')}
          >
            Lobbies
          </button>
          <button
            className={styles.layoutsGameVariousItem}
            onClick={(e) => router.push('/game/rooms')}
          >
            Rooms
          </button>

          {validateCreateGame && (
            <button
              onClick={(e) => setIsCreateOpen(true)}
              className={styles.layoutsGameVariousAdd}
            >
              <AiOutlineAppstoreAdd />
              <Portal selector="#modal">
                <Modal isOpen={isCreateOpen} setOpen={setIsCreateOpen}>
                  <CreateGameModal gameType={validateCreateGame} />
                </Modal>
              </Portal>
            </button>
          )}
        </div>
        {children}
      </div>
    )

  return <Fragment>{children}</Fragment>
}
export default GamePath

const GameSection: Record<string, number> = {
  lobbies: 0,
  rooms: 1,
  matches: 2,
}

const ValidCreateGameSection: Record<string, GameType> = {
  lobbies: gameType[0],
  rooms: gameType[1],
}

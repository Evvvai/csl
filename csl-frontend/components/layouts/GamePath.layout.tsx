import { FC, Fragment, useEffect, useState } from 'react'

// Styles
import styles from '../../styles/layouts/Layouts.module.scss'

// Component

// Custom hooks
import { useRouter } from 'next/dist/client/router'

// Utils

//////////////////////////////////////////////////////////////////////////////////////
const GamePath: FC = ({ children }) => {
  const router = useRouter()

  const [section, setSection] = useState<number | undefined>(undefined)

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
          <button onClick={(e) => router.push('/game/lobbies')}>Lobbies</button>
          <button onClick={(e) => router.push('/game/rooms')}>Rooms</button>
          <button
            onClick={(e) => {
              // router.push('/friends/none')
            }}
          >
            . . . . .
          </button>
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

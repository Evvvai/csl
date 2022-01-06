import { FC, Fragment } from 'react'

// Styles
import styles from '../../styles/layouts/Layouts.module.scss'
const { layoutsMain, layoutsMainTip } = styles

// Component
import Room from 'components/room/Room.component'
import FriendAside from 'components/friend-aside/FriendAside.component'
import NotificationAside from 'components/notification-aside/NotificationAside.component'
import CreateGame from '../create-game/CreateGame.component'

// Custom hooks
import { useRoom } from 'hooks/store/room'
import { useLobby } from '../../hooks/store/lobby/useLobby'

// Utils

//////////////////////////////////////////////////////////////////////////////////////
const MainLayout: FC = ({ children }) => {
  const { currentLobby } = useLobby()
  const { currentRoom } = useRoom()

  return (
    <main className={layoutsMain}>
      {children}
      <div className={layoutsMainTip}>
        {currentRoom?.id === undefined && currentLobby?.id === undefined ? (
          <CreateGame />
        ) : currentRoom?.id !== undefined ? (
          <Room />
        ) : currentLobby?.id !== undefined ? (
          <div />
        ) : (
          <Fragment />
        )}
      </div>
      <FriendAside />
      <NotificationAside />
    </main>
  )
}
export default MainLayout

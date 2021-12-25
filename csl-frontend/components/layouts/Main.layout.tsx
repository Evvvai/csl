import { FC } from 'react'

// Styles
import styles from '../../styles/layouts/Layouts.module.scss'
const { layoutsMain, layoutsMainTip } = styles

// Component
import Room from 'components/room/Room.component'
import FriendAside from 'components/friend-aside/FriendAside.component'

// Utils

//////////////////////////////////////////////////////////////////////////////////////
const MainLayout: FC = ({ children }) => {
  return (
    <main className={layoutsMain}>
      {children}
      <div className={layoutsMainTip}>
        <Room />
      </div>
      <FriendAside />
    </main>
  )
}
export default MainLayout

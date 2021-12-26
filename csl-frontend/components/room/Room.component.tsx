import React, { Fragment, memo, useRef, useState } from 'react'

// Styles
import styles from './Room.module.scss'
import { useUser } from '../../hooks/store/user/useUser'
const {
  room,
  roomContent,
  players,
  playersItem,
  playersAdd,
  playersLeader,
  playersLLeader,
  Empty,
  description,
  setting,
  settingItem,
  hrV,
  create,
  moveFriend,
  mode,
  modeActive,
} = styles

// Components
import Ico from '../../assets/icon/Menu.svg'
import SettingsIcon from '../../assets/icon/Settings.svg'
import LeaveIcon from '../../assets/icon/Close.svg'
import CrownIcon from '../../assets/icon/Crown.svg'
import CCrownIcon from '../../assets/icon/CCrown.svg'
import { GiFireflake } from 'react-icons/gi'
import Setting from './Setting/Setting.component'

// Custom hooks
import { useFriend } from 'hooks/store/friend'
import { useRoom } from 'hooks/store/room'

// Utils
import cn from 'classnames'
import { Portal } from 'utils/portal'
import Modal from '../UI/Modal/Modal.component'
import DashboardEditModal from 'components/profile/DasboardEdit/DashboardEdit.component'
import { clientHandle } from 'utils/graphql'
import { CREATE_ROOM, DELETE_ROOM } from 'types/graphql/mutation'
import { maxPlayers, MaxPlayers } from '@store'
import DeleteRoom from './DeleteRoom/DeleteRoom.component'
import { useRouter } from 'next/dist/client/router'

interface Props {}

/**
 *
 * Everything in this component must be moved to the custom hook && redux
 *
 */

///////////////////////////////////////////////////////////////////////////////////////////
export default function Room(props: Props): JSX.Element {
  const { isLoading, currentRoom, createRoom, leaveRoom, deleteRoom } =
    useRoom()
  const { isFriendOpen, openFriend } = useFriend()
  const { isLoggedIn, userInfo } = useUser()
  const router = useRouter()

  const [isSettings, setIsSettings] = useState<boolean>(false)
  const [isSelectMode, setIsSelectMode] = useState<boolean>(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false)

  const handleClickCreate = (maxPlayers: MaxPlayers) => async () => {
    if (!isLoggedIn) {
      router.push(process.env.BACKEND_URL + '/auth/steam')
      return
    }
    if (!isLoading) createRoom(maxPlayers)
    setIsSelectMode(false)
  }
  const handleClickLeave = () => {
    if (currentRoom.captainId === userInfo.id) setIsDeleteOpen(true)
    else leaveRoom(currentRoom)
  }
  const handleClickInvite = () => openFriend()
  const handleClickSetting = () => setIsSettings(!isSettings)
  const handleClickSelectMode = () => setIsSelectMode(!isSelectMode)

  // Need create separete component
  if (!currentRoom?.id) {
    return (
      <div className={cn(room, { [moveFriend]: isFriendOpen })}>
        <div className={roomContent}>
          <div onClick={handleClickSelectMode} className={create}>
            <GiFireflake />
          </div>
          <div className={cn(mode, { [modeActive]: isSelectMode })}>
            <span onClick={handleClickCreate('TWO')}>x2</span>
            <span onClick={handleClickCreate('THREE')}>x3</span>
            <span onClick={handleClickCreate('FIVE')}>x5</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(room, { [moveFriend]: isFriendOpen })}>
      <div className={roomContent}>
        <div className={players}>
          {currentRoom.users.map((user) => {
            return (
              <div key={user.id} className={playersItem}>
                <img src={user.avatarCustom} />
                {user.id === currentRoom.captainId ? (
                  <CrownIcon className={playersLeader} />
                ) : (
                  <div></div>
                )}
              </div>
            )
          })}

          {[...Array(currentRoom.maxPlayers - currentRoom.users.length)].map(
            (empty, key) => {
              return (
                <div
                  key={key}
                  onClick={handleClickInvite}
                  className={cn(playersItem, { [Empty]: true })}
                >
                  <LeaveIcon className={playersAdd} />
                </div>
              )
            }
          )}
        </div>
        <hr className={hrV} />
        <div className={setting}>
          <SettingsIcon onClick={handleClickSetting} className={settingItem} />
          <LeaveIcon onClick={handleClickLeave} className={settingItem} />
          <Portal selector="#modal">
            <Modal isOpen={isDeleteOpen} setOpen={setIsDeleteOpen}>
              <DeleteRoom
                setOpen={setIsDeleteOpen}
                handleClickLeave={(e) => deleteRoom(currentRoom)}
              />
            </Modal>
          </Portal>
        </div>
        <Setting setOpen={setIsSettings} isOpen={isSettings} />{' '}
        {/* Need rework */}
      </div>
    </div>
  )
}

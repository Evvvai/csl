import React, { Fragment, useState } from 'react'

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
  setting,
  settingItem,
  hrV,
  moveFriend,
  start,
  startContent,
  search,
  searchContent,
} = styles

// Icons
import SettingsIcon from '../../assets/icon/Settings.svg'
import LeaveIcon from '../../assets/icon/Close.svg'
import CrownIcon from '../../assets/icon/Crown.svg'
import { GiCrossedSwords } from 'react-icons/gi'
import { RiZzzFill } from 'react-icons/ri'

// Components
import Setting from './setting/Setting.component'

// Custom hooks
import { useFriend } from 'hooks/store/friend'
import { useRoom } from 'hooks/store/room'

// Utils
import cn from 'classnames'
import { Portal } from 'utils/portal'
import Modal from '../UI/Modal/Modal.component'
import DeleteRoom from './delete-room/DeleteRoom.component'

type GameType = 'lobby' | 'room'

interface Props {}

/**
 *
 * Everything in this component must be moved to the custom hook && redux
 *
 */

///////////////////////////////////////////////////////////////////////////////////////////
export default function Room(props: Props): JSX.Element {
  const { currentRoom, leaveRoom, deleteRoom } = useRoom()
  const { isFriendOpen, openFriend } = useFriend()
  const { userInfo } = useUser()

  const [isSettings, setIsSettings] = useState<boolean>(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false)
  const [isSearch, setIsSearch] = useState<boolean>(false)

  const handleClickLeave = () => {
    if (currentRoom.captainId === userInfo.id) setIsDeleteOpen(true)
    else leaveRoom(currentRoom)
  }
  const handleClickInvite = () => openFriend()
  const handleClickSetting = () => setIsSettings(!isSettings)

  const handleClickSearch = (search: boolean) => () => setIsSearch(search)

  // if (currentRoom.id !== undefined) {
  return (
    <div className={cn(room, { [moveFriend]: isFriendOpen })}>
      <div className={roomContent}>
        <div className={players}>
          {currentRoom.users.map((user) => {
            return (
              <div key={user.id} className={playersItem}>
                <img
                  src={
                    user.avatarCustom !== null
                      ? user.avatarCustom
                      : user.avatarfull
                      ? user.avatarfull
                      : process.env.AVATAR_NULL
                  }
                />
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
              <DeleteRoom handleClickLeave={(e) => deleteRoom(currentRoom)} />
            </Modal>
          </Portal>
        </div>
        <Setting setOpen={setIsSettings} isOpen={isSettings} />
        {/* Need rework */}
        <div className={start}>
          {isSearch ? (
            <div className={startContent} onClick={handleClickSearch(false)}>
              <RiZzzFill />
            </div>
          ) : (
            <div className={startContent} onClick={handleClickSearch(true)}>
              <GiCrossedSwords />
            </div>
          )}
        </div>
        {isSearch && (
          <div className={search}>
            <div className={searchContent}>
              <span>Match searching...</span>
            </div>
          </div>
        )}
        {/* Mb later */}
        {/* 
        <div className={info}>
          <span className={infoItem}>aaaaa</span>
          <span className={infoItem}>aaaaa</span>
          <span className={infoItem}>aaaaa</span>
          <span className={infoItem}>aaaaa</span>
        </div> 
        */}
      </div>
    </div>
  )
  // }
}

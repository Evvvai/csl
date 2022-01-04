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
  type,
  typeActive,
  start,
  startContent,
  info,
  infoItem,
  search,
  searchContent,
} = styles

// Icons
import Ico from '../../assets/icon/Menu.svg'
import SettingsIcon from '../../assets/icon/Settings.svg'
import LeaveIcon from '../../assets/icon/Close.svg'
import CrownIcon from '../../assets/icon/Crown.svg'
import CCrownIcon from '../../assets/icon/CCrown.svg'
import { GiAbstract061 } from 'react-icons/gi'
import { GiCrossedSwords } from 'react-icons/gi'
import { RiZzzFill } from 'react-icons/ri'
import { GrMore } from 'react-icons/gr'
import { BiGridVertical } from 'react-icons/bi'

// Components
import Setting from './setting/Setting.component'

// Custom hooks
import { useFriend } from 'hooks/store/friend'
import { useRoom } from 'hooks/store/room'

// Utils
import cn from 'classnames'
import { Portal } from 'utils/portal'
import Modal from '../UI/Modal/Modal.component'
import { MaxPlayers } from '@store'
import DeleteRoom from './delete-room/DeleteRoom.component'
import { useRouter } from 'next/dist/client/router'

type GameType = 'lobby' | 'room'

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
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false)

  const [generateStage, setGenerateStage] = useState<0 | 1 | 2>(0)
  const [isSelectType, setIsSelectType] = useState<GameType | null>(null)

  // hardcode must remove into redux
  const [isSearch, setIsSearch] = useState<boolean>(false)

  const handleClickLeave = () => {
    if (currentRoom.captainId === userInfo.id) setIsDeleteOpen(true)
    else leaveRoom(currentRoom)
  }
  const handleClickInvite = () => openFriend()
  const handleClickSetting = () => setIsSettings(!isSettings)

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
    isSelectType === 'room' ? createRoom(maxPlayers) : createRoom(maxPlayers)

    setGenerateStage(0)
  }
  const handleClickSearch = (search: boolean) => () => setIsSearch(search)

  // Need create separete component
  if (!currentRoom?.id) {
    return (
      <div className={cn(room, { [moveFriend]: isFriendOpen })}>
        <div className={roomContent}>
          <div onClick={handleClickGenerate} className={create}>
            <GiAbstract061 />
          </div>
          <div className={cn(type, { [typeActive]: generateStage === 1 })}>
            <span onClick={handleClickSelectType('room')}>
              <BiGridVertical />
            </span>
            <span onClick={handleClickSelectType('lobby')}>
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
  }

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
              <DeleteRoom
                setOpen={setIsDeleteOpen}
                handleClickLeave={(e) => deleteRoom(currentRoom)}
              />
            </Modal>
          </Portal>
        </div>
        <Setting setOpen={setIsSettings} isOpen={isSettings} />{' '}
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
        {/* <div className={info}>
          <span className={infoItem}>aaaaa</span>
          <span className={infoItem}>aaaaa</span>
          <span className={infoItem}>aaaaa</span>
          <span className={infoItem}>aaaaa</span>
        </div> */}
      </div>
    </div>
  )
}

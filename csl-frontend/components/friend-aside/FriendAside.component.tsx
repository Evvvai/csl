import React from 'react'

// Styles
import styles from './FriendAside.module.scss'
const {
  friend,
  Open,
  friendContent,
  title,
  hrH,
  search,
  searchInput,
  searchItem,
  searchIcon,
  cFriends,
  cFriendsItem,
  cFriendsImg,
  cFriendsInfo,
  cFriendsStatus,
  cFriendsInvite,
  exit,
  Online,
} = styles

// Components
import { MdPersonAdd } from 'react-icons/md'
import { AiOutlineCloudSync } from 'react-icons/ai'
import { MdOutlineManageSearch } from 'react-icons/md'
import { IoIosClose } from 'react-icons/io'
import { MdLibraryAdd } from 'react-icons/md'

// Custom hooks
import { useFriend } from 'hooks/store/friend'

// Utils
import cn from 'classnames'
import { useRouter } from 'next/dist/client/router'
import { useRoom } from 'hooks/store/room'

///////////////////////////////////////////////////////////////////////////////////////////
export default function FriendAside(): JSX.Element {
  const {
    isFriendOpen,
    openFriend,
    closeFriend,
    updateFriends,
    friendsList,
    isFriendLoad,
  } = useFriend()

  const { currentRoom } = useRoom()

  const router = useRouter()
  const handleClickClose = () => closeFriend()
  const handleClickNewFriend = () => updateFriends()
  const handleClickOpenProfile = (steamid64: string) => () => {
    router.push('/' + steamid64)
    closeFriend()
  }

  return (
    <div className={cn(friend, { [Open]: isFriendOpen })}>
      <div className={friendContent}>
        <header className={title}>
          <h1>Friends</h1>
        </header>
        <hr className={hrH} />
        <div className={search}>
          <MdOutlineManageSearch className={cn(searchIcon)} />
          <input className={searchInput} />
          <MdPersonAdd className={searchIcon} />
          <AiOutlineCloudSync
            className={searchIcon}
            onClick={handleClickNewFriend}
          />
        </div>
        <div className={cFriends}>
          <ul>
            {!isFriendLoad ? (
              <div>Loading...</div>
            ) : friendsList.length === 0 ? (
              <div>{/* <img src={NOT_FOUND} /> */}</div>
            ) : (
              [...friendsList]
                .sort((x, y) => Number(y.status) - Number(x.status))
                .map((val) => {
                  return (
                    <li key={val.id} className={cFriendsItem}>
                      <div
                        onClick={handleClickOpenProfile(val.steamId64)}
                        className={cFriendsImg}
                      >
                        <img
                          src={
                            val.avatarCustom !== null
                              ? val.avatarCustom
                              : val.avatarfull
                              ? val.avatarfull
                              : process.env.AVATAR_NULL
                          }
                        />
                        <div
                          className={cn(cFriendsStatus, {
                            [Online]: val.status,
                          })}
                        />
                      </div>
                      <div className={cFriendsInfo}>
                        <span>{val.username}</span>
                        <span>...</span>
                      </div>
                      {/* Need implement cooldown */}
                      {currentRoom?.id && (
                        <MdLibraryAdd className={cFriendsInvite} />
                      )}
                    </li>
                  )
                })
            )}
          </ul>
        </div>
        <IoIosClose onClick={handleClickClose} className={exit} />
      </div>
    </div>
  )
}

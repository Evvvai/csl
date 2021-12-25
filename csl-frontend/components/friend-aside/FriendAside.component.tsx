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
  friends,
  friendsItem,
  friendsImg,
  friendsInfo,
  exit,
} = styles

// Components
import { MdPersonAdd } from 'react-icons/md'
import { AiOutlineCloudSync } from 'react-icons/ai'
import { MdOutlineManageSearch } from 'react-icons/md'
import { IoIosClose } from 'react-icons/io'

// Custom hooks
import { useFriend } from 'hooks/store/app'

// Utils
import cn from 'classnames'

///////////////////////////////////////////////////////////////////////////////////////////
export default function FriendAside(): JSX.Element {
  const { isFriendOpen, openFriend, closeFriend } = useFriend()

  const handleClickClose = () => closeFriend()

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
          <AiOutlineCloudSync className={searchIcon} />
        </div>
        <div className={friends}>
          <ul>
            {[...Array(10)].map((x) => {
              return (
                <li className={friendsItem}>
                  <img src={process.env.AVATAR_NULL} className={friendsImg} />
                  <div className={friendsInfo}>
                    <span>Evai</span>
                    <span>...</span>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
        <IoIosClose onClick={handleClickClose} className={exit} />
      </div>
    </div>
  )
}

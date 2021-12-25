import React, {
  createRef,
  Fragment,
  memo,
  useEffect,
  useRef,
  useState,
} from 'react'

// Styles
import styles from './Header.module.scss'
const {
  header,
  headerNav,
  headerNavFirst,
  headerNavSecond,
  signin,
  menuProfile,
  Active,
  menuProfileAvatar,
  menuProfileChevron,
  headerUl,
  headerLi,
  hrV,
} = styles

// Components
import Icon from 'components/icon/Icon.component'
import ChevronIcon from '../../assets/icon/Chevron.svg'
import { FaUserFriends } from 'react-icons/fa'
import { MdNotificationsActive } from 'react-icons/md'
import { GiBowenKnot } from 'react-icons/gi'

// Custom hooks
import { useNetworkChange } from '../../hooks/events/useNetworkChange'
import { useUser } from 'hooks/store/user'
import { useFriend } from 'hooks/store/app'

// Utils
import { Portal } from 'utils/portal'
import Link from 'next/link'
import cn from 'classnames'
import Menu from './menu/Menu.component'

///////////////////////////////////////////////////////////////////////////////////////////
export default function Header(): JSX.Element {
  // const { isOnline } = useNetworkChange() // For pwa
  const { isFriendOpen, openFriend, closeFriend } = useFriend()
  const { isLoggedIn, user } = useUser()

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

  const menuButtonRef = createRef()

  const MenuChevron = React.forwardRef((props, ref: any) => (
    <div
      ref={ref}
      className={menuProfileChevron}
      onClick={(e) => setIsMenuOpen(!isMenuOpen)}
    >
      <ChevronIcon />
    </div>
  ))

  return (
    <Fragment>
      {/* <div className={offline}>
        <Icon asset="Moon" className={offlineIcon} />
        You are currently browsing in offline mode.
      </div> */}
      <header className={header}>
        <nav className={headerNav}>
          <div className={headerNavFirst}>
            <ul className={headerUl}>
              <li className={headerLi}>
                <GiBowenKnot />
              </li>
              <li className={headerLi}>
                <Link href={'/'}>
                  <a>Home</a>
                </Link>
              </li>
              <li className={headerLi}>
                <hr className={hrV} />
              </li>
              <li className={headerLi}>
                <Link href={'/leaderbord'}>
                  <a>Leaderbord</a>
                </Link>
              </li>
              <li className={headerLi}>
                <hr className={hrV} />
              </li>
              <li className={headerLi}>
                <Link href={'/lobbies'}>
                  <a>Lobby</a>
                </Link>
              </li>
            </ul>
          </div>
          <div className={headerNavSecond}>
            <ul className={headerUl}>
              {isLoggedIn ? (
                <Fragment>
                  <li className={headerLi}>
                    <MdNotificationsActive />
                  </li>
                  <li
                    onClick={() =>
                      isFriendOpen ? closeFriend() : openFriend()
                    }
                    className={headerLi}
                  >
                    <FaUserFriends />
                  </li>

                  <li className={headerLi}>
                    <div
                      className={cn(menuProfile, {
                        [Active]: isMenuOpen,
                      })}
                    >
                      <Link href={'/' + user.steamId64}>
                        <a>
                          <img
                            className={menuProfileAvatar}
                            src={
                              user.avatarCustom !== null
                                ? user.avatarCustom
                                : user.avatarfull
                                ? user.avatarfull
                                : process.env.AVATAR_NULL
                            }
                            alt="Evai"
                            width="32"
                            height="32"
                          />
                        </a>
                      </Link>

                      <MenuChevron ref={menuButtonRef} />

                      {isMenuOpen && (
                        <Menu
                          menuButtonRef={menuButtonRef}
                          setOpen={setIsMenuOpen}
                        />
                      )}
                    </div>
                  </li>
                </Fragment>
              ) : (
                <li className={cn(headerLi, signin)}>
                  {/* <Icon /> */}
                  <a href={process.env.BACKEND_URL + '/auth/steam'}>Sign In</a>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </header>
    </Fragment>
  )
}

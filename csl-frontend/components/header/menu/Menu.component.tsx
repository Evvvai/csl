import React, { Fragment, memo, useRef, useState } from 'react'

// Styles
import styles from './Menu.module.scss'
const {
  menu,
  profileDashboard,
  profileImage,
  profile,
  item,
  itemIcon,
  footer,
  footerIcon,
  itemHr,
} = styles

// Components
import Icon from 'components/icon/Icon.component'
import FooterWave from '../../../assets/icon/FooterWave.svg'
import ThemeSection from './theme-section/ThemeSection.component'
import { GiBowenKnot } from 'react-icons/gi'

// Custom hooks
import { useUser } from 'hooks/store/user'
import { useOutsideClick } from 'hooks/events'

// Utils
import Link from 'next/link'
import cn from 'classnames'

interface Props {
  setOpen: any
  menuButtonRef: any
}

///////////////////////////////////////////////////////////////////////////////////////////
export default function Menu(props: Props): JSX.Element {
  const { user } = useUser()

  const menuRef = useRef(null)
  const handleOutsideClick = () => {
    props.setOpen(false)
  }

  useOutsideClick([menuRef, props.menuButtonRef], handleOutsideClick)

  return (
    <div ref={menuRef} className={menu}>
      <ul>
        <li className={profile}>
          <Link href={'/' + user.steamId64}>
            <a>
              <img
                className={profileDashboard}
                src={
                  user.dashboard !== null
                    ? user.dashboard
                    : process.env.DASHBOARD_NULL
                }
              />
              <div className={profileImage}>
                <img
                  src={
                    user.avatarCustom !== null
                      ? user.avatarCustom
                      : user.avatarfull
                      ? user.avatarfull
                      : process.env.AVATAR_NULL
                  }
                />
                <span>Evai</span>
              </div>
            </a>
          </Link>
        </li>
        <li className={item}>
          <Link href={'/'}>
            <a>
              <GiBowenKnot className={itemIcon} />
              <span>Not Implimented</span>
            </a>
          </Link>
        </li>
        <li className={item}>
          <Link href={'/'}>
            <a>
              <GiBowenKnot className={itemIcon} />
              <span>Not Implimented</span>
            </a>
          </Link>
        </li>
        <li className={item}>
          <Link href={'/'}>
            <a>
              <GiBowenKnot className={itemIcon} />
              <span>Not Implimented</span>
            </a>
          </Link>
        </li>
        <li className={item}>
          <Link href={'/'}>
            <a>
              <GiBowenKnot className={itemIcon} />
              <span>Not Implimented</span>
            </a>
          </Link>
        </li>
        <hr className={itemHr} />
        <li className={item}>
          <Link href={'/'}>
            <a>
              <GiBowenKnot className={itemIcon} />
              <span>Not Implimented</span>
            </a>
          </Link>
        </li>
        <li className={item}>
          <Link href={'/'}>
            <a>
              <GiBowenKnot className={itemIcon} />
              <span>Not Implimented</span>
            </a>
          </Link>
        </li>
        <li className={item}>
          <ThemeSection />
        </li>
      </ul>
      {/* <div className={footer}>
        <FooterWave className={footerIcon} />
      </div> */}

      <footer className={footer}>
        <FooterWave />
        {/* <Icon asset={'FooterWave'} /> */}
      </footer>
    </div>
  )
}

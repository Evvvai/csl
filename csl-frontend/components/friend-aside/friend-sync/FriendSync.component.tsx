import React, { FC, Fragment, useEffect, useState } from 'react'
import cn from 'classnames'

// Styles
import styles from './FriendSync.module.scss'
import { Friend } from '@store'
import dayjs from 'dayjs'
const {
  formContent,
  formInner,
  moduleHeader,
  moduleHeaderTitle,
  moduleHeaderClose,
  moduleSubmit,
  moduleSubmitAgree,
  moduleInfo,
  hrH,
  moduleContent,
  moduleList,
  moduleItem,
  moduleItemImg,
  moduleItemInfo,
  moduleItemNone,
  moduleItemLoading,
  moduleClose,
} = styles

// Icons
import { IoIosClose } from 'react-icons/io'

// Components

// Custom Hooks

// Utils

// Interface
interface Props {
  updateFriends: any

  close?: any
  isOpen?: any
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export default function FriendSync(props: Props): JSX.Element {
  const [isLoad, setIsLoad] = useState<boolean>(false)
  const [newFriends, setNewFriends] = useState<Friend[]>([])

  useEffect(() => {
    if (!props.isOpen) return
    setIsLoad(false)
    setNewFriends([])

    props.updateFriends().then((friends) => {
      setIsLoad(true)
      setNewFriends(friends)
    })
  }, [props.isOpen])

  return (
    <form onClick={(e) => e.stopPropagation()} className={formContent}>
      <section className={formInner}>
        <div className={moduleHeader}>
          <div className={moduleHeaderTitle}>
            Synchronizing friends with steam
          </div>
          <div className={moduleHeaderClose}>{/* <Close /> */}</div>
        </div>
        <hr className={hrH} />
        <div className={moduleInfo}>
          <p>
            If a player is registered on the site and he is also in your list of
            friends steem, he will be added to the friends
          </p>
        </div>

        <div className={moduleContent}>
          {!isLoad ? (
            <div className={moduleItemLoading}>
              <h1>Loading...</h1>
            </div>
          ) : newFriends.length === 0 ? (
            <div className={moduleItemNone}>
              <h1>Not founded</h1>
              <img src={process.env.NOT_INVITES} />
            </div>
          ) : (
            <Fragment>
              <h1>You gotcha friends ({newFriends.length}) </h1>
              <ul className={moduleList}>
                {newFriends
                  .sort((x, y) => Number(y.online) - Number(x.online))
                  .map((val) => {
                    return (
                      <li key={val.id} className={moduleItem}>
                        <div className={moduleItemImg}>
                          <img
                            src={
                              val.avatarCustom !== null
                                ? val.avatarCustom
                                : val.avatarfull
                                ? val.avatarfull
                                : process.env.AVATAR_NULL
                            }
                          />
                        </div>
                        <div className={moduleItemInfo}>
                          <span>{val.username}</span>
                          {val.online ? (
                            <span>{val.status.action}</span>
                          ) : (
                            <span>{dayjs(val.lastLogin).fromNow()}</span>
                          )}
                        </div>
                      </li>
                    )
                  })}
              </ul>
              <div onClick={handleClickClose} className={moduleSubmit}>
                <div className={moduleSubmitAgree}>Okay...</div>
              </div>
            </Fragment>
          )}
        </div>
      </section>
      <div className={moduleClose} onClick={props.close}>
        <IoIosClose />
      </div>
    </form>
  )
}

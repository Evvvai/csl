import React from 'react'

// Styles
import styles from './NotificationAside.module.scss'
const {
  Open,
  notificationAside,
  content,
  title,
  hrH,
  list,
  item,
  notFound,
  invite,
  inviteContent,
  invitePlayers,
  invitePlayer,
  Empty,
  inviteControl,
  inviteHeader,
} = styles

// Components
import { MdPersonAdd } from 'react-icons/md'
import { RiSendPlaneFill } from 'react-icons/ri'
import { IoMdRemoveCircleOutline } from 'react-icons/io'

// Custom hooks
import { useNotification } from 'hooks/store/notification'

// Utils
import cn from 'classnames'
import { useRouter } from 'next/dist/client/router'
import dayjs from 'dayjs'
import { LobbyInvites } from '@store'

///////////////////////////////////////////////////////////////////////////////////////////
export default function NotificationAside(): JSX.Element {
  const {
    openNotification,
    closeNotification,
    isNotificationLoad,
    isNotificationOpen,
    lobbyInvites,
    acceptInvite,
    declineInvite,
  } = useNotification()

  const router = useRouter()

  const handleClickClose = () => {}
  const handleClickAccept = (invite: LobbyInvites) => () => {
    acceptInvite(invite)
    closeNotification()
  }
  const handleClickDecline = (invite: LobbyInvites) => () =>
    declineInvite(invite)

  return (
    <div className={cn(notificationAside, { [Open]: isNotificationOpen })}>
      <div className={content}>
        <div className={title}>
          <h1>Notifications</h1>
        </div>
        <hr className={hrH} />
        <div></div>
        <ul className={list}>
          {lobbyInvites.length === 0 ? (
            <div className={notFound}>
              <h1>No one needs you</h1>
              <img src={process.env.NOT_INVITES} />
            </div>
          ) : (
            lobbyInvites.map((val) => {
              return (
                <li key={val.room.id + val.user.id} className={item}>
                  <div className={invite}>
                    <div className={inviteHeader}>
                      <span>
                        {dayjs(new Date(val.sentAt || 0)).format('h:mm A')}
                      </span>
                      <span>{val.user.username}</span>
                      <img
                        src={
                          val.user.avatarCustom !== null
                            ? val.user.avatarCustom
                            : val.user.avatarfull
                            ? val.user.avatarfull
                            : process.env.AVATAR_NULL
                        }
                      />
                    </div>
                    <div className={inviteContent}>
                      <div className={invitePlayers}>
                        {val.room.users.map((user) => {
                          return (
                            <div key={user.id} className={invitePlayer}>
                              <img
                                src={
                                  user.avatarCustom !== null
                                    ? user.avatarCustom
                                    : user.avatarfull
                                    ? user.avatarfull
                                    : process.env.AVATAR_NULL
                                }
                              />
                              {/* {user.id === currentRoom.captainId ? (
                                <CrownIcon className={playersLeader} />
                              ) : (
                                <div></div>
                              )} */}
                            </div>
                          )
                        })}

                        {[
                          ...Array(val.room.maxPlayers - val.room.users.length),
                        ].map((empty, key) => {
                          return (
                            <div
                              key={key}
                              className={cn(invitePlayer, { [Empty]: true })}
                            >
                              {/* <LeaveIcon className={playersAdd} /> */}
                            </div>
                          )
                        })}
                      </div>

                      <div className={inviteControl}>
                        <RiSendPlaneFill onClick={handleClickAccept(val)} />
                        <IoMdRemoveCircleOutline
                          onClick={handleClickDecline(val)}
                        />
                      </div>
                    </div>
                  </div>
                </li>
              )
            })
          )}
        </ul>
      </div>
    </div>
  )
}

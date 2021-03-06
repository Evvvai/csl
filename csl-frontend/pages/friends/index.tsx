import { Fragment, useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import Head from 'next/head'

// Styles
import styles from '../../styles/friends/Friends.module.scss'

// Icons
import { RiDeleteBin5Fill } from 'react-icons/ri'

// Components
import MyInput from '../../components/UI/MyInput/MyInput.component'
import FriendsPath from '../../components/layouts/FriendsPath.layout'

// Custom hook
import { useFriend } from '../../hooks/store/friend'
import { useFriendFiltered } from '../../hooks/store/friend'

// Utils
import { useRouter } from 'next/dist/client/router'
import dayjs from 'dayjs'

interface Props {}

/////////////////////////////////////////////////////////////////////////////////////
const Friends = (props: Props) => {
  const { termFriend, filteredFriendsIds, filteringFriends } =
    useFriendFiltered()
  const { friendsList } = useFriend()
  const router = useRouter()

  const [term, setTerm] = useState<string>(termFriend)

  // Sync term
  useEffect(() => {
    setTerm(termFriend)
  }, [termFriend])

  return (
    <Fragment>
      <Head>
        <title>cSurfLeague</title>
        <meta
          name="description"
          property="og:description"
          content="cSurfLeague"
        />
        <meta name="og:title" content="cSurfLeague" />
        <meta name="robots" content="INDEX,FOLLOW" />
      </Head>
      <section className={styles.friends}>
        <div className={styles.friendsContent}>
          <div className={styles.search}>
            <MyInput
              label={'write term'}
              model={{ value: term, setValue: setTerm }}
              type={'text'}
              name={'search'}
              callback={filteringFriends}
              debounce={350}
            />
          </div>
          <div className={styles.list}>
            {[
              ...friendsList.filter((x) =>
                filteredFriendsIds.find((y) => y === x.id)
              ),
              ...hardcodedata,
            ]
              .sort((x, y) => Number(y.online) - Number(x.online))
              .map((friend, key) => {
                return (
                  <div
                    key={friend.id.toString() + key}
                    onClick={(e) => router.push('/' + friend.steamId64)}
                    className={styles.item}
                  >
                    <div className={styles.itemFriend}>
                      <img
                        className={styles.avatar}
                        src={
                          friend.avatarCustom !== null
                            ? friend.avatarCustom
                            : friend.avatarfull
                            ? friend.avatarfull
                            : process.env.AVATAR_NULL
                        }
                      />
                      <div className={styles.info}>
                        <div className={styles.infoName}>{friend.username}</div>
                        <div className={styles.infoOnline}>
                          {friend.online ? (
                            <span>. . .</span>
                          ) : (
                            <span>{dayjs(friend.lastLogin).fromNow()}</span>
                          )}
                        </div>
                      </div>
                      <div className={styles.options}>
                        <RiDeleteBin5Fill />
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </section>
    </Fragment>
  )
}

export default Friends

Friends.getInitialProps = async ({ query, store, res }) => {}

Friends.getLayout = function getLayout(page: ReactElement) {
  return <FriendsPath>{page}</FriendsPath>
}

const hardcodedata = [
  {
    id: 6,
    steamId64: '76561198995056878',
    username: 'hardcodedata',
    profileurl: 'https://steamcommunity.com/profiles/76561198995056878/',
    avatarfull:
      'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/b0/b0c77d6890f782d7af00be623ba3d3a71a3fb435_full.jpg',
    avatarCustom:
      'https://i.pinimg.com/originals/6d/cf/20/6dcf20b7f96dd4108e1f95ee800730f6.gif',
    dashboard: null,
    dateReg: '2021-12-26T14:24:05.238Z',
    lastLogin: '2001-12-28T12:44:40.985Z',
    role: 'user',
    online: false,
  },
  {
    id: 6,
    steamId64: '76561198995056878',
    username: 'hardcodedata',
    profileurl: 'https://steamcommunity.com/profiles/76561198995056878/',
    avatarfull:
      'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/b0/b0c77d6890f782d7af00be623ba3d3a71a3fb435_full.jpg',
    avatarCustom:
      'https://i.pinimg.com/originals/df/b2/f7/dfb2f73b7aae41844e03a67a4e874bc3.gif',
    dashboard: null,
    dateReg: '2021-12-26T14:24:05.238Z',
    lastLogin: '2021-11-28T12:44:40.985Z',
    role: 'user',
    online: false,
  },
  {
    id: 6,
    steamId64: '76561198995056878',
    username: 'hardcodedata',
    profileurl: 'https://steamcommunity.com/profiles/76561198995056878/',
    avatarfull:
      'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/b0/b0c77d6890f782d7af00be623ba3d3a71a3fb435_full.jpg',
    avatarCustom:
      'https://c.tenor.com/CnTIv2m_RLsAAAAC/serial-experiments-lain-lain-iwakura.gif',
    dashboard: null,
    dateReg: '2021-12-26T14:24:05.238Z',
    lastLogin: '2021-12-18T12:44:40.985Z',
    role: 'user',
    online: false,
  },
  {
    id: 6,
    steamId64: '76561198995056878',
    username: 'hardcodedata',
    profileurl: 'https://steamcommunity.com/profiles/76561198995056878/',
    avatarfull:
      'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/b0/b0c77d6890f782d7af00be623ba3d3a71a3fb435_full.jpg',
    avatarCustom: 'https://media4.giphy.com/media/vP5gXvSXJ2olG/giphy.gif',
    dashboard: null,
    dateReg: '2021-12-26T14:24:05.238Z',
    lastLogin: '2021-12-26T12:44:40.985Z',
    role: 'user',
    online: false,
  },
]

import { Fragment, useEffect, useState } from 'react'
import Head from 'next/head'

// Styles
import styles from '../../../styles/lobbies/Lobbies.module.scss'
const {
  lobbies,
  lobbiesContent,
  item,
  title,
  lobby,
  lobbyHeader,
  lobbyHr,
  lobbyInner,
  lobbyPlayer,
  various,
  hrCircle,
  hrLobby,
  innerLeft,
  innerRight,
  innerPlayer,
  x1,
  x2,
  x3,
  x5,
  gg,
  nonePlayer,
} = styles

// Icons
import { GiBowenKnot } from 'react-icons/gi'
import cn from 'classnames'

// Components

// Custom hook
import { useUser } from 'hooks/store/user'
import { LOBBIES } from 'types/graphql/quary'
import client, { clientHandle } from 'utils/graphql'
import { LobbyTeams } from '@store'

// Utils

interface Props {
  lobbies: LobbyTeams[]
}

/////////////////////////////////////////////////////////////////////////////////////
const Lobbies = (props: Props) => {
  const { isLoggedIn } = useUser()
  const [section, setSection] = useState<number>(0)

  useEffect(() => {
    if (isLoggedIn) {
      // console.log('props', props.lobbies)
    }
  }, [])

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
      <section className={lobbies}>
        <div className={lobbiesContent}>
          {isLoggedIn ? (
            props.lobbies?.map((val, key) => {
              return (
                <div key={key} className={item}>
                  <div className={lobby}>
                    <div className={lobbyHeader}>
                      <div>{`${val.ctTeam.length}/${val.maxPlayers}`}</div>
                      <span>{val.firstTeamName}</span>
                      <span>{val.secondTeamName}</span>
                      <div>{`${val.tTeam.length}/${val.maxPlayers}`}</div>
                    </div>
                    <hr className={hrLobby} />

                    <div className={hrCircle}>
                      <div className={cn(innerLeft, TeamSize[val.maxPlayers])}>
                        {val.ctTeam.map((ct) => {
                          return (
                            <div key={ct.id} className={innerPlayer}>
                              <div>{ct.username}</div>
                              <img
                                src={
                                  ct.avatarCustom !== null
                                    ? ct.avatarCustom
                                    : ct.avatarfull
                                    ? ct.avatarfull
                                    : process.env.AVATAR_NULL
                                }
                              />
                            </div>
                          )
                        })}
                        {[...Array(val.maxPlayers - val.ctTeam.length)].map(
                          (val, key) => {
                            return (
                              <div key={key} className={innerPlayer}>
                                <span className={nonePlayer}></span>
                              </div>
                            )
                          }
                        )}
                      </div>
                      <span>{`${val.maxPlayers}x${val.maxPlayers}`}</span>
                      <div className={cn(innerRight, TeamSize[val.maxPlayers])}>
                        {val.tTeam.map((t) => {
                          return (
                            <div key={t.id} className={innerPlayer}>
                              <div>{t.username}</div>
                              <img
                                src={
                                  t.avatarCustom !== null
                                    ? t.avatarCustom
                                    : t.avatarfull
                                    ? t.avatarfull
                                    : process.env.AVATAR_NULL
                                }
                              />
                            </div>
                          )
                        })}
                        {[...Array(val.maxPlayers - val.tTeam.length)].map(
                          (val, key) => {
                            return (
                              <div key={key} className={innerPlayer}>
                                <span className={nonePlayer}></span>
                              </div>
                            )
                          }
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <section className={lobbies}>
              <img className={''} src={process.env.NOT_PERMISSION} />
              <h1>Not authorization</h1>
            </section>
          )}
        </div>
      </section>
    </Fragment>
  )
}

export default Lobbies

export const getServerSideProps = async (ctx) => {
  try {
    const [data, errors] = await clientHandle(LOBBIES, {
      page: ctx.query?.page,
    })

    return {
      props: {
        lobbies: data,
      },
    }
  } catch (err) {
    // console.log('err', err)
  }
}

const TeamSize: Record<number, typeof x2 | typeof x3 | typeof x5> = {
  [2]: x2,
  [3]: x3,
  [5]: x5,
}

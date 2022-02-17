import { Fragment, useEffect } from 'react'
import type { ReactElement } from 'react'
import Head from 'next/head'

// Styles
import styles from '../../../styles/game/Lobbies.module.scss'

// Icons
import { GiBowenKnot } from 'react-icons/gi'
import cn from 'classnames'

// Components
import GamePath from '../../../components/layouts/GamePath.layout'

// Custom hook
import { useUser } from 'hooks/store/user'
import { LOBBIES } from 'types/graphql/quary'
import { serverHandle } from 'utils/graphql'
import { setLobbies } from 'stores/lobby.slice'
import { useLobby } from '../../../hooks/store/lobby/useLobby'

// Utils
const TeamSize: Record<
  number,
  typeof styles.x2 | typeof styles.x3 | typeof styles.x5
> = {
  [2]: styles.x2,
  [3]: styles.x3,
  [5]: styles.x5,
}

// Interface
interface Props {}

/////////////////////////////////////////////////////////////////////////////////////
const Lobbies = (props: Props) => {
  const { lobbies } = useLobby()
  const { isLoggedIn } = useUser()

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
      <section className={styles.lobbies}>
        <div className={styles.lobbiesContent}>
          {isLoggedIn ? (
            lobbies?.map((val, key) => {
              return (
                <div key={key} className={styles.item}>
                  <div className={styles.lobby}>
                    <div className={styles.lobbyHeader}>
                      <div>{`${val.ctTeam.length}/${val.maxPlayers}`}</div>
                      <span>{val.firstTeamName}</span>
                      <span>{val.secondTeamName}</span>
                      <div>{`${val.tTeam.length}/${val.maxPlayers}`}</div>
                    </div>
                    <hr className={styles.hrLobby} />

                    <div className={styles.hrCircle}>
                      <div
                        className={cn(
                          styles.innerLeft,
                          TeamSize[val.maxPlayers]
                        )}
                      >
                        {val.ctTeam.map((ct) => {
                          return (
                            <div key={ct.id} className={styles.innerPlayer}>
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
                              <div key={key} className={styles.innerPlayer}>
                                <span className={styles.nonePlayer}></span>
                              </div>
                            )
                          }
                        )}
                      </div>
                      <span>{`${val.maxPlayers}x${val.maxPlayers}`}</span>
                      <div
                        className={cn(
                          styles.innerRight,
                          TeamSize[val.maxPlayers]
                        )}
                      >
                        {val.tTeam.map((t) => {
                          return (
                            <div key={t.id} className={styles.innerPlayer}>
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
                              <div key={key} className={styles.innerPlayer}>
                                <span className={styles.nonePlayer}></span>
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
            <section className={styles.lobbies}>
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

Lobbies.getInitialProps = async ({ query, store, res }) => {
  const page = Math.abs(+query?.page) || 1

  const [data, errors] = await serverHandle(res, LOBBIES, {
    page,
  })

  store.dispatch(setLobbies(data))
}

Lobbies.getLayout = function getLayout(page: ReactElement) {
  return <GamePath>{page}</GamePath>
}

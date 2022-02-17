import { Fragment, useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import Head from 'next/head'

// Styles
import styles from '../../../styles/game/Rooms.module.scss'

// Icons
import { GiBowenKnot } from 'react-icons/gi'
import cn from 'classnames'

// Components
import GamePath from '../../../components/layouts/GamePath.layout'

// Custom hook
import { useUser } from 'hooks/store/user'
import { LOBBIES } from 'types/graphql/quary'
import { serverHandle } from 'utils/graphql'
import { LobbyTeams } from '@store'

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
interface Props {
  // rooms: Rooms[]
}

/////////////////////////////////////////////////////////////////////////////////////
const Rooms = (props: Props) => {
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
      <section className={styles.rooms}>
        <div className={styles.roomsContent}></div>
      </section>
    </Fragment>
  )
}

export default Rooms

// Rooms.getInitialProps = async ({ query, store, res }) => {
//   const page = Math.abs(+query?.page) || 1
//   const [data, errors] = await serverHandle(res, ROOMS, {
//     page,
//   })
//   return {
//     props: {
//       lobbies: data,
//     },
//   }
// }

Rooms.getLayout = function getLayout(page: ReactElement) {
  return <GamePath>{page}</GamePath>
}

import { Fragment, useEffect } from 'react'
import Head from 'next/head'

// Components
import { GiBowenKnot } from 'react-icons/gi'

// Custom hook

// Utils

// Styles
import styles from '../../styles/lobbies/Lobbies.module.scss'
const {
  lobbies,
  lobbiesContent,
  item,
  title,
  lobbyHeader,
  lobbyHr,
  lobbyInner,
  lobbyPlayer,
} = styles

interface Props {}

/////////////////////////////////////////////////////////////////////////////////////
const Lobbies = (props: Props) => {
  useEffect(() => {}, [])

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
        <header className={title}>
          <h1>Lobbies</h1>
          <hr />
        </header>
        <div className={lobbiesContent}>
          {[...Array(5)].map((x) => {
            return (
              <div className={item}>
                <div className={lobbyHeader}>
                  <div>3x3</div>
                  <span>team_evai</span>
                  <GiBowenKnot />
                </div>
                <hr className={lobbyHr} />
                <div className={lobbyInner}>
                  {/* <div className={lobbyPlayer}>1</div>
                  <div className={lobbyPlayer}>2</div>
                  <div className={lobbyPlayer}>3</div> */}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </Fragment>
  )
}

export default Lobbies

// export async function getStaticProps(context: any): Promise<GetStaticPropsResult<Props>> {

//   return {
//     props: {
//     },
//   };
// }

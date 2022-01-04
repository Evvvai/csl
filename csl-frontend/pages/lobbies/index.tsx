import { Fragment, useEffect, useState } from 'react'
import Head from 'next/head'

// Styles
import styles from '../../styles/lobbies/Lobbies.module.scss'
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

// Utils

interface Props {}

/////////////////////////////////////////////////////////////////////////////////////
const Lobbies = (props: Props) => {
  const { isLoggedIn } = useUser()
  const [section, setSection] = useState<number>(0)

  useEffect(() => {
    if (isLoggedIn) {
    }
  }, [])

  if (!isLoggedIn) {
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
          </header>
          <div className={various}>
            <span
              style={{ transform: 'translateX(' + 100 * section + 'px)' }}
            />
            <button onClick={(e) => setSection(0)}>Lobbies</button>
            <button onClick={(e) => setSection(1)}>Matches</button>
            <button onClick={(e) => setSection(2)}>. . . . .</button>
          </div>
          <img className={''} src={process.env.NOT_PERMISSION} />
          <h1>Not authorization</h1>
        </section>
      </Fragment>
    )
  }

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
        </header>
        <div className={various}>
          <span style={{ transform: 'translateX(' + 100 * section + 'px)' }} />
          <button onClick={(e) => setSection(0)}>Lobbies</button>
          <button onClick={(e) => setSection(1)}>Matches</button>
          <button onClick={(e) => setSection(2)}>. . . . .</button>
        </div>
        <div className={lobbiesContent}>
          {[...Array(5)].map((x, key) => {
            return (
              <div key={key} className={item}>
                <div className={lobby}>
                  <div className={lobbyHeader}>
                    <div>3/5</div>
                    <span>team_a</span>
                    <span>team_b</span>
                    <div>3/5</div>
                  </div>
                  <hr className={hrLobby} />

                  <div className={hrCircle}>
                    <div className={cn(innerLeft, x5)}>
                      <div className={innerPlayer}>
                        <span className={nonePlayer}></span>
                      </div>
                      <div className={innerPlayer}>
                        <div>1111</div>
                        <img src={process.env.AVATAR_NULL} />
                      </div>
                      <div className={innerPlayer}>
                        <span className={nonePlayer}></span>
                      </div>
                      <div className={innerPlayer}>
                        <span className={nonePlayer}></span>
                      </div>
                      <div className={innerPlayer}>
                        <span className={nonePlayer}></span>
                      </div>
                    </div>
                    <span>5x5</span>
                    <div className={cn(innerRight, x5)}>
                      <div className={innerPlayer}>
                        <img src={process.env.AVATAR_NULL} />
                        <div>1111</div>
                      </div>
                      <div className={innerPlayer}>
                        <img src={process.env.AVATAR_NULL} />
                        <div>1111</div>
                      </div>
                      <div className={innerPlayer}>
                        <span className={nonePlayer}></span>
                      </div>
                      <div className={innerPlayer}>
                        <span className={nonePlayer}></span>
                      </div>
                      <div className={innerPlayer}>
                        <span className={nonePlayer}></span>
                      </div>
                    </div>
                  </div>
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

//  <div className={innerPlayer}>
//               <img src={process.env.AVATAR_NULL} />
//               <span>1111</span>
//             </div>

// export async function getStaticProps(context: any): Promise<GetStaticPropsResult<Props>> {

//   return {
//     props: {
//     },
//   };
// }

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
]

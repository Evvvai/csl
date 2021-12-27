import { Fragment } from 'react'
import Head from 'next/head'

// Components

// Utils

// Styles
import styles from '../styles/home/Home.module.scss'
import Link from 'next/link'
const { home, homeContent } = styles

interface Props {}

/////////////////////////////////////////////////////////////////////////////////////
const Home = (props: Props) => {
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
      <div className={home}>
        <section className={homeContent}>
          <span>Oh yea black & white</span>
          <Link href={'/leaderboard'}>
            <a>
              <span>Leaderboard</span>
            </a>
          </Link>
          <span>blank</span>
        </section>
      </div>
    </Fragment>
  )
}

export default Home

// export async function getStaticProps(context: any): Promise<GetStaticPropsResult<Props>> {

//   return {
//     props: {
//     },
//   };
// }

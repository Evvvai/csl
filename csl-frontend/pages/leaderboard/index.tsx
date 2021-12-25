import { Fragment, useEffect, useState } from 'react'
import Head from 'next/head'

// Components

// Custom hook

// Utils

// Styles
// import styles from '../styles/home/Home.module.scss'
// const { home, homeContent } = styles

interface Props {}

/////////////////////////////////////////////////////////////////////////////////////
const Leaderboard = (props: Props) => {
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
      <div>a</div>
    </Fragment>
  )
}

export default Leaderboard

// export async function getStaticProps(context: any): Promise<GetStaticPropsResult<Props>> {

//   return {
//     props: {
//     },
//   };
// }

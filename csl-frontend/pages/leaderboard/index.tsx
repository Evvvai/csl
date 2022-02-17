import { Fragment, useEffect, useState } from 'react'
import Head from 'next/head'
import type { ReactElement } from 'react'

// Styles
// import styles from '../styles/home/Home.module.scss'

// Components

// Custom hook

// Utils

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

Leaderboard.getInitialProps = async ({ query, store, res }) => {}

Leaderboard.getLayout = function getLayout(page: ReactElement) {
  return <Fragment>{page}</Fragment>
}

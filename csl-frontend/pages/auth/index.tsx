import { Fragment, useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/dist/client/router'

// Components

// Custom hook
import { useUser } from '../../hooks/store/user/useUser'

// Utils
import { browserStorage } from 'utils/browser'
import client from 'utils/graphql'

// Styles
// import styles from '../styles/home/Home.module.scss'
// const { home, homeContent } = styles

interface Props {}

/////////////////////////////////////////////////////////////////////////////////////
const Auth = (props: Props) => {
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const { authUser } = useUser()
  const router = useRouter()
  const token: any = router.query.token

  useEffect(() => {
    if (token) {
      ;(async () => setIsValid(await authUser('Bearer ' + token)))()
    }
  }, [token])

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
      {isValid ? (
        <div>Yep!</div>
      ) : isValid === null ? (
        <div>Loading</div>
      ) : (
        <div>Nope</div>
      )}
    </Fragment>
  )
}

export default Auth

// export async function getStaticProps(context: any): Promise<GetStaticPropsResult<Props>> {

//   return {
//     props: {
//     },
//   };
// }

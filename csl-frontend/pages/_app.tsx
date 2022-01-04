import '../styles/index.scss' // Styles
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from '../contexts/theme' // Theme Use Context
import { wrapper } from 'stores'
import Cookies, { parseCookies } from 'nookies'
import { useEffect } from 'react'

// Layouts
import MainLayout from 'components/layouts/Main.layout'

// Components
import Header from '../components/header/Header.component'
import Footer from 'components/footer/Footer.component'

// Custom hooks
import { useApp } from 'hooks/store/app'
import { useUser } from 'hooks/store/user'

// Utils
import { GraphQLClient } from 'graphql-request'
import getBearerToken from 'utils/getBearerToken'
import { AUTH } from 'types/graphql/mutation'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import { setUserSetting } from 'stores/user.slice'
import { appLoaded } from 'stores/app.slice'

/////////////////////////////////////////////////////////////////////////////////////
function MyApp({ Component, pageProps }: AppProps) {
  const { isLoad, appLoad } = useApp()
  const { authUser } = useUser()

  useEffect(() => {
    // appLoad()
    authUser(getBearerToken()) // For tests it's better suited...but it's without cfr, so it will need to be removed
    dayjs.extend(relativeTime)
    dayjs.extend(duration)
    dayjs.locale('ru')
  }, [])

  if (!isLoad) return <div>Ladno</div>

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1, minimum-scale=1, user-scalable=0, viewport-fit=cover"
        />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content={'black-translucent'}
        />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <ThemeProvider>
        {/* <NotificationList /> */}
        <Header />
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
        <Footer />
      </ThemeProvider>
    </>
  )
}

// Auth store hydrate
// MyApp.getInitialProps = wrapper.getInitialAppProps(
//   (store) =>
//     async ({ ctx, Component }) => {
//       try {
//         const cookies = ctx ? Cookies.get(ctx) : parseCookies()
//         const token = cookies.token

//         const client = new GraphQLClient(
//           process.env.NEXT_BACKEND_URL + '/graphql',
//           {
//             headers: { authorization: 'Bearer ' + token },
//           }
//         )

//         const data = await client.request(AUTH)
//         store.dispatch(setUserSetting(data.auth.user))
//         console.log('data', data)
//       } catch (err) {
//         // console.log('err', err)
//         return {
//           pageProps: Component.getInitialProps
//             ? await Component.getInitialProps({ ...ctx, store })
//             : {},
//         }
//       }
//     }
// )

export default wrapper.withRedux(MyApp)

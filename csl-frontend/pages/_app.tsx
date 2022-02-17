import '../styles/index.scss' // Styles
import Head from 'next/head'
import { ThemeProvider } from '../contexts/theme' // Theme Use Context
import { useDispatch } from 'react-redux'
import { wrapper } from 'stores'

// Layouts
import MainLayout from 'components/layouts/Main.layout'

// Components
import Header from '../components/header/Header.component'
import Footer from 'components/footer/Footer.component'

// Custom hooks
import { useUser } from '../hooks/store/user/useUser'

// Utils
import { AUTH } from 'types/graphql/mutation'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import { setUserSetting } from 'stores/user.slice'
import { serverHandle } from '../utils/graphql/index'

import { Fragment, ReactElement, ReactNode, useEffect } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { appLoaded } from 'stores/app.slice'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

/////////////////////////////////////////////////////////////////////////////////////
function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const { isLoggedIn } = useUser()
  const dispatch = useDispatch()

  dayjs.extend(relativeTime)
  dayjs.extend(duration)
  dayjs.locale('ru')
  dayjs.locale('en')

  useEffect(() => {
    //* Due to the fact that sockets work on the client side, we have to initialize them here
    if (isLoggedIn) dispatch({ type: 'socket/connect' })
  }, [])

  const getLayout = Component.getLayout ?? ((page) => page)

  return getLayout(
    <Fragment>
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
    </Fragment>
  )
}

// Auth store hydrate
MyApp.getInitialProps = wrapper.getInitialAppProps(
  (store) =>
    async ({ ctx, Component }) => {
      if (!store.getState().app.isLoad) {
        const [data, erros] = await serverHandle(ctx, AUTH, {})

        if (data && !erros) {
          store.dispatch(setUserSetting(data.user))

          // const [room, roomErrors] = await clientHandle(ACTIVE_ROOM, {})

          // if (room && !roomErrors) activedRoom(room)
          // else {
          //   const [lobby, lobbyErrors] = await clientHandle(ACTIVE_LOBBY, {})
          //   if (lobby && !lobbyErrors) activedLobby(lobby)
          // }
        }
        store.dispatch(appLoaded())
      }

      return {
        pageProps: {
          ...(Component.getInitialProps
            ? await Component.getInitialProps({ ...ctx, store })
            : {}),
        },
      }
    }
)

export default wrapper.withRedux(MyApp)

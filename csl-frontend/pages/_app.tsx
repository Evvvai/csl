import '../styles/index.scss' // Styles
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from '../contexts/theme' // Theme Use Context
import { wrapper } from 'stores'
import Cookies, { parseCookies } from 'nookies'

// Layouts
import MainLayout from 'components/layouts/Main.layout'

/* May be reworekd... */
import FriendsPath from 'components/layouts/FriendsPath.layout'
import GamePath from 'components/layouts/GamePath.layout'

// Components
import Header from '../components/header/Header.component'
import Footer from 'components/footer/Footer.component'

// Custom hooks

// Utils
import { GraphQLClient } from 'graphql-request'
import { AUTH } from 'types/graphql/mutation'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import { setUserSetting } from 'stores/user.slice'
import { serverHandle } from '../utils/graphql/index'

/////////////////////////////////////////////////////////////////////////////////////
function MyApp({ Component, pageProps }: AppProps) {
  dayjs.extend(relativeTime)
  dayjs.extend(duration)
  dayjs.locale('ru')
  dayjs.locale('en')

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
          <FriendsPath>
            <GamePath>
              <Component {...pageProps} />
            </GamePath>
          </FriendsPath>
        </MainLayout>
        <Footer />
      </ThemeProvider>
    </>
  )
}

// Auth store hydrate
MyApp.getInitialProps = wrapper.getInitialAppProps(
  (store) =>
    async ({ ctx, Component }) => {
      if (!store.getState().app.isLoad) {
        // const cookies = ctx ? Cookies.get(ctx) : parseCookies()
        // const token = cookies.token
        // const client = new GraphQLClient(
        //   process.env.NEXT_BACKEND_URL + '/graphql',
        //   {
        //     headers: { authorization: 'Bearer ' + token },
        //   }
        // )
        // client.request(AUTH)

        const [data, erros] = await serverHandle(ctx, AUTH, {})
        if (data && !erros) store.dispatch(setUserSetting(data.user))
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

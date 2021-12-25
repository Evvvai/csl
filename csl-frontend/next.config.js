/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path')

const avatarNull =
  'https://firebasestorage.googleapis.com/v0/b/trick-a871a.appspot.com/o/image%2Fdashboard.gif?alt=media&token=e2bb410b-bde1-475d-9baa-bfd9a71f6f11'

const dashboardNull =
  'https://firebasestorage.googleapis.com/v0/b/csleague-2ecff.appspot.com/o/dashboard%2F1?alt=media&token=31a8ceb5-ead2-4d23-b48a-51fb03aa3e9a'

// GenerateSitemap
// const generateSitemap = require('./scripts/sitemap')
// const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
// const sitemapDest = path.resolve('.next/static')

// ServiceWorker
// const serviceWorkerPath = 'static/sw.js'
// const serviceWorkerUrl = `/_next/${serviceWorkerPath}`
// const serviceWorkerDest = `.next/${serviceWorkerPath}`

module.exports = {
  webpack5: true,
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx'],
  sassOptions: {
    prependData: `@import "styles/variables.scss";`,
    includePaths: [path.join(__dirname, 'styles')],
  },
  env: {
    BACKEND_URL: process.env.NEXT_APP_BACKEND_URL,
    DASHBOARD_NULL: dashboardNull,
    AVATAR_NULL: avatarNull,
    NEXT_APIKEY: process.env.NEXT_APIKEY,
    NEXT_AUTHDOMAIN: process.env.NEXT_AUTHDOMAIN,
    NEXT_PROJECTID: process.env.NEXT_PROJECTID,
    NEXT_STORAGEBUCKET: process.env.NEXT_STORAGEBUCKET,
    NEXT_MESSAGINGSENDERID: process.env.NEXT_MESSAGINGSENDERID,
    NEXT_APPID: process.env.NEXT_APPID,
    NEXT_MEASUREMENTID: process.env.NEXT_MEASUREMENTID,
  },
  excludeFile: (str) => /\/src\/sw\/.*/.test(str),
  webpackDevMiddleware: (config) => {
    config.watchOption = {
      pool: 1000,
      aggregateTimeout: 300,
    }
    return config
  },
  webpack: (config) => {
    config.module.rules.push(
      {
        test: /\.svg$/,
        loader: '@svgr/webpack',
      },
      {
        test: /\.html$/,
        loader: 'raw-loader',
      }
    )

    return config
  },
  // headers: () => [
  //   {
  /*
   * Since we're outputing service worker
   * with static files in /_next/static directory
   * we have to return the service worker file with an additional header
   * so that the browser would know that it's safe to run it on the root scope.
   */
  // source: serviceWorkerUrl,
  // headers: [
  //   {
  //     key: 'service-worker-allowed',
  //     value: '/'
  //   }
  // ]
  // }
  // ]
}

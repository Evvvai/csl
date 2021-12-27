/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path')

const avatarNull =
  'https://firebasestorage.googleapis.com/v0/b/csleague-2ecff.appspot.com/o/avatar%2Favatar.gif?alt=media&token=b75ff4ef-2142-465c-b44b-a4a1ed9230e9'

const dashboardNull =
  'https://firebasestorage.googleapis.com/v0/b/csleague-2ecff.appspot.com/o/dashboard%2Fdashboard.jpg?alt=media&token=455fd849-d65f-4142-956c-e5913668bcf3'

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
    NOT_FOUND:
      'https://garnetgaming.net/forums/uploads/monthly_2018_11/lain-transparent-static-4.gif.abf402297aef7303cde0c2da0ebc81be.gif',
    NOT_INVITES:
      // 'https://lh3.googleusercontent.com/proxy/C5ExsFVwl-ukI8RMJQbAhCTZJzPyh-u_wQsD3HqBnFWBRLc-PpHClB4Q5CODNxZ4iR-m8qB6q8jaEsoekJCAJU9T6ciG6UFcjaZyAhWRQ0oqKRZv8GxT3rAEhMMRmFKrFvVM',
      'https://firebasestorage.googleapis.com/v0/b/csleague-2ecff.appspot.com/o/etc%2Fnot_invites.gif?alt=media&token=1b1d83e1-f6f4-4a48-85cb-5520663ced0a',
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

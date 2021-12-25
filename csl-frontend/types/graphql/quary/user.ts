import { gql } from 'graphql-request'

export const USER = gql`
  query ($steamid64: String!) {
    findOne(steamid64: $steamid64) {
      id
      steamId64
      username
      profileurl
      avatarfull
      avatarCustom
      dashboard
      dateReg
      lastLogin
      role
    }
  }
`

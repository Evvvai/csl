import { gql } from 'graphql-request'

export const AUTH = gql`
  mutation {
    auth {
      token
      user {
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
  }
`

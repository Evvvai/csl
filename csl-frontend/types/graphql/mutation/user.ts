import { gql } from 'graphql-request'

export const SET_AVATAR = gql`
  mutation ($url: String!) {
    setAvatar(url: $url) {
      id
      steamId64
      avatarCustom
    }
  }
`

export const SET_DASHBOARD = gql`
  mutation ($url: String!) {
    setDashboard(url: $url) {
      id
      steamId64
      dashboard
    }
  }
`
export const USER_NEW_FRIENDS = gql`
  mutation {
    userNewFriends {
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

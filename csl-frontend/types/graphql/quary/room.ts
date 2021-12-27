import { gql } from 'graphql-request'

export const ACTIVE_ROOM = gql`
  query {
    activeRoom {
      id
      name
      captainId
      maxPlayers
      isPublic
      isShare
      status
      createdAt
      udaptedAt
      users {
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

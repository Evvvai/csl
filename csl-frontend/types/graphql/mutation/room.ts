import { gql } from 'graphql-request'

export const CREATE_ROOM = gql`
  mutation ($maxPlayers: MaxPlayers!) {
    createRoom(input: { maxPlayers: $maxPlayers }) {
      id
      name
      captainId
      maxPlayers
      isPublic
      isSearch
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

export const DELETE_ROOM = gql`
  mutation {
    removeRoom
  }
`

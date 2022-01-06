import { gql } from 'graphql-request'

export const CREATE_LOBBY = gql`
  mutation ($maxPlayers: MaxPlayers!) {
    createLobby(input: { maxPlayers: $maxPlayers }) {
      id
      name
      captainId
      firstTeamName
      secondTeamName
      maxPlayers
      isPublic
      status
      createdAt
      udaptedAt
      ctTeam: usersTeam(input: { name: CT }) {
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
      tTeam: usersTeam(input: { name: T }) {
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

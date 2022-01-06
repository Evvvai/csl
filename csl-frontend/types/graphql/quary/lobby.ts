import { gql } from 'graphql-request'

export const ACTIVE_LOBBY = gql`
  query {
    activeLobby {
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

export const LOBBIES = gql`
  query {
    lobbies {
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

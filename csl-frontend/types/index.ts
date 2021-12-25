export enum Theme {
  default = 'default',
  light = 'light',
  dark = 'dark',
}

export interface GQLErrors {
  error: string
  message: string[]
  statusCode: number
}

import ActionCreators from '../../../stores/user.slice'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from '@reduxjs/toolkit'
import { useTypesSelector } from '../useTypesSelector'
import { useCallback } from 'react'
import client, { clientHandle } from 'utils/graphql'
import { browserStorage } from 'utils/browser'
import { AUTH } from 'types/graphql/mutation'
import { useApp } from '../app/useApp'
import { destroyCookie, setCookie } from 'nookies'

// User Hook Selector / Dispatch
////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const useUser = () => {
  const { appLoad } = useApp()

  const dispatch = useDispatch()

  const { setUserSetting, removeUserSetting } = bindActionCreators(
    ActionCreators.actions,
    dispatch
  )
  const { isLoggedIn, userInfo } = useTypesSelector((state) => state.user)

  const logOut = useCallback(() => {
    removeUserSetting()
    // destroyCookie(null, 'token')
    // browserStorage.removeItem('token') // Obsolete
  }, [])

  const authUser = useCallback(async (token: string): Promise<boolean> => {
    if (isLoggedIn || !token) {
      appLoad()
      return false
    }

    client.setHeader('authorization', token)
    const { data, errors } = await clientHandle(AUTH, {})

    if (!errors && data) setUser(data.auth)
    else logOut()

    appLoad()
    return !errors && data ? true : false
  }, [])

  const setUser = useCallback(async (data: any) => {
    // browserStorage.setItem('token', data.token)  // Obsolete
    setCookie(null, 'token', data.token, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    })
    setUserSetting(data.user)
  }, [])

  return { isLoggedIn, userInfo, authUser, logOut, setUser }
}

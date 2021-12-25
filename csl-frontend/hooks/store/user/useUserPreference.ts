import ActionCreators from '../../../stores/user.slice'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from '@reduxjs/toolkit'
import { useTypesSelector } from '../useTypesSelector'
import { useCallback } from 'react'
import { clientHandle } from 'utils/graphql'
import { SET_AVATAR, SET_DASHBOARD } from 'types/graphql/mutation'
import { useRouter } from 'next/dist/client/router'

// User Preference Hook Selector / Dispatch
////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const useUserPreference = () => {
  const router = useRouter()

  const dispatch = useDispatch()

  const { setAvatar, setDashboard } = bindActionCreators(
    ActionCreators.actions,
    dispatch
  )

  const changeAvatar = useCallback((url: string) => {
    setAvatar(url)
    clientHandle(SET_AVATAR, { url: url })
    router.reload()
  }, [])

  const changeDashboard = useCallback((url: string) => {
    setDashboard(url)
    clientHandle(SET_DASHBOARD, { url: url })
    router.reload()
  }, [])

  return { changeAvatar, changeDashboard }
}

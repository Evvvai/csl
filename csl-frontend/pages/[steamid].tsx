import client, { clientHandle } from 'utils/graphql'
import { USER } from 'types/graphql/quary'
import { NextPage } from 'next'

// Styles
import styles from '../styles/profile/Profile.module.scss'
const {
  profile,
  Dashboard,
  DashboardEdit,
  DashboardBack,
  info,
  Avatar,
  AvatarImage,
  AvatarBack,
  AvatarEdit,
  Name,
  wave,
  profileInner,
} = styles

// Components
import Icon from 'components/icon/Icon.component'
import FooterWaveIcon from '../assets/icon/FooterWave.svg'
import AvatarEditModal from 'components/profile/avatar-edit/AvatarEdit.component'
import DashboardEditModal from 'components/profile/dasboard-edit/DashboardEdit.component'

// Custom hooks
import { useUser } from '../hooks/store/user/useUser'

// Utils
import cn from 'classnames'
import { User } from 'types/store'
import { useState } from 'react'
import { Portal } from 'utils/portal'
import Modal from 'components/UI/Modal/Modal.component'

interface Props {
  userData: User
}

/////////////////////////////////////////////////////////////////////////////////////
const Profile: NextPage<Props> = ({ userData }) => {
  const { userInfo } = useUser()

  const [isAvatarEdit, setIsAvatarEdit] = useState<boolean>(false)
  const [isDashboardEdit, setIsDashboardEdit] = useState<boolean>(false)

  return (
    <>
      {/* <Head></Head> */}
      <div className={profile}>
        <div className={Dashboard}>
          <img
            src={
              userData.dashboard !== null
                ? userData.dashboard
                : process.env.DASHBOARD_NULL
            }
            alt="nope"
          ></img>
          <div className={DashboardBack} />

          {userData.id === userInfo?.id && (
            <div
              onClick={(e) => setIsDashboardEdit(true)}
              className={DashboardEdit}
            >
              <Icon asset={'Edit'} />
              <Portal selector="#modal">
                <Modal isOpen={isDashboardEdit} setOpen={setIsDashboardEdit}>
                  <DashboardEditModal />
                </Modal>
              </Portal>
            </div>
          )}
        </div>

        <div className={info}>
          <div className={Avatar}>
            <div className={AvatarBack}></div>
            <img
              className={AvatarImage}
              src={
                userData.avatarCustom !== null
                  ? userData.avatarCustom
                  : userData.avatarfull
                  ? userData.avatarfull
                  : process.env.AVATAR_NULL
              }
              alt="nope"
            ></img>
            {userData.id === userInfo?.id && (
              <div
                onClick={(e) => setIsAvatarEdit(true)}
                className={AvatarEdit}
              >
                <Icon asset={'Edit'} />
                <Portal selector="#modal">
                  <Modal isOpen={isAvatarEdit} setOpen={setIsAvatarEdit}>
                    <AvatarEditModal />
                  </Modal>
                </Portal>
              </div>
            )}
          </div>
          <span className={Name}>{userData.username}</span>
        </div>
        <FooterWaveIcon className={wave} />
        <div className={profileInner}>
          <span>blank</span>
        </div>
      </div>
    </>
  )
}

export const getServerSideProps = async (ctx) => {
  try {
    const [data, errors] = await clientHandle(USER, {
      steamid64: ctx.params.steamid,
    })

    if (!data || errors) {
      return {
        props: {},
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    } else {
      return {
        props: {
          userData: data,
        },
      }
    }
  } catch (err) {
    // console.log('err', err)
    return {
      props: {},
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
}

export default Profile

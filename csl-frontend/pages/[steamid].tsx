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
import AvatarEditModal from 'components/profile/AvatarEdit/AvatarEdit.component'
import DashboardEditModal from 'components/profile/DasboardEdit/DashboardEdit.component'
import FooterWaveIcon from '../assets/icon/FooterWave.svg'

// Custom hooks

// Utils
import cn from 'classnames'
import { User } from 'types/store'
import { useState } from 'react'
import { Portal } from 'utils/portal'
import Modal from 'components/UI/Modal/Modal.component'

interface Props {
  user: User
}

/////////////////////////////////////////////////////////////////////////////////////
const Profile: NextPage<Props> = ({ user }) => {
  const [isAvatarEdit, setIsAvatarEdit] = useState<boolean>(false)
  const [isDashboardEdit, setIsDashboardEdit] = useState<boolean>(false)

  return (
    <>
      {/* <Head></Head> */}
      <div className={profile}>
        <div className={Dashboard}>
          <img
            src={
              user.dashboard !== null
                ? user.dashboard
                : process.env.DASHBOARD_NULL
            }
            alt="nope"
          ></img>
          <div className={DashboardBack} />

          <div
            onClick={(e) => setIsDashboardEdit(true)}
            className={DashboardEdit}
          >
            <Icon asset={'Edit'} />
            <Portal selector="#modal">
              <Modal isOpen={isDashboardEdit} setOpen={setIsDashboardEdit}>
                <DashboardEditModal setOpen={setIsDashboardEdit} />
              </Modal>
            </Portal>
          </div>
        </div>

        <div className={info}>
          <div className={Avatar}>
            <div className={AvatarBack}></div>
            <img
              className={AvatarImage}
              src={
                user.avatarCustom !== null
                  ? user.avatarCustom
                  : user.avatarfull
                  ? user.avatarfull
                  : process.env.AVATAR_NULL
              }
              alt="nope"
            ></img>
            <div onClick={(e) => setIsAvatarEdit(true)} className={AvatarEdit}>
              <Icon asset={'Edit'} />
              <Portal selector="#modal">
                <Modal isOpen={isAvatarEdit} setOpen={setIsAvatarEdit}>
                  <AvatarEditModal setOpen={setIsAvatarEdit} />
                </Modal>
              </Portal>
            </div>
          </div>
          <span className={Name}>{user.username}</span>
        </div>
        <FooterWaveIcon className={wave} />
        <div className={profileInner}>
          <span>blank</span>
          <span>blank</span>
          <span>blank</span>
          <span>blank</span>
          <span>blank</span>
          <span>blank</span>
          <span>blank</span>
          <span>blank</span>
          <span>blank</span>
          <span>blank</span>
          <span>blank</span>
          <span>blank</span>
          <span>blank</span>
          <span>blank</span>
          <span>blank</span>
          <span>blank</span>
          <span>blank</span>
          <span>blank</span>
          <span>blank</span>
          <span>blank</span>
          <span>blank</span>
        </div>
      </div>
    </>
  )
}

export const getServerSideProps = async (ctx) => {
  try {
    const variables = {
      steamid64: ctx.params.steamid,
    }
    const data = await client.request(USER, variables)

    return {
      props: {
        user: data.findOne,
      },
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

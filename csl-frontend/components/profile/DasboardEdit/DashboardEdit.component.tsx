import React, { FC, useState } from 'react'
import cn from 'classnames'
import LinearProgress from '@mui/material/LinearProgress'

// Styles
import styles from './DashboardEdit.module.scss'
const {
  formContent,
  formInner,
  paHeader,
  paHeaderTitle,
  paHeaderClose,
  paPreview,
  paPreviewInfo,
  paPreviewInput,
  paPreviewImg,
  paInfo,
  paInfoItem,
  paSubmit,
  paSubmitUpload,
  paSubmitUploadActive,
  paSubmitClose,
} = styles

// Components

// Custom Hooks
import { useUser } from 'hooks/store/user'
import { useUserPreference } from 'hooks/store/user/useUserPreference'

// Utils
import { storage } from '../../../utils/firebase'
import { uploadBytesResumable, ref, getDownloadURL } from '@firebase/storage'

// Interface
interface Props {
  setOpen: any
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export default function DashboardEdit(props: Props): JSX.Element {
  const { changeDashboard } = useUserPreference()
  const { userInfo } = useUser()

  const [image, setImage] = useState<any>({
    image: null,
    imageUrl: userInfo?.dashboard,
  })
  const [progress, setProgress] = useState<any>(0)

  const handleChange = (e: any) => {
    if (
      (e.target.files[0].type === 'image/gif' ||
        e.target.files[0].type === 'image/jpeg' ||
        e.target.files[0].type === 'image/jpg' ||
        e.target.files[0].type === 'image/png') &&
      e.target.files[0].size < 9999999
    ) {
      setImage({
        image: e.target.files[0],
        imageUrl: URL.createObjectURL(e.target.files[0]),
      })
    }
    console.log(e.target.files[0])
  }

  const clickCloseHandler = (e: any) => {
    // props.setAvatarEditorShow(false)
  }

  const clickUploadHandler = (e: any) => {
    const storageRef = ref(storage, `dashboard/${userInfo.id.toString()}`)
    const uploadTask = uploadBytesResumable(storageRef, image.image)

    if (!verifyImage()) return

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        )
        setProgress(progress)
      },
      (error) => {
        console.log(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          props.setOpen(false)
          changeDashboard(downloadURL)
        })
      }
    )
  }

  const verifyImage = () => {
    if (userInfo.dashboard !== image.imageUrl && progress === 0) return true

    return false
  }

  return (
    <form onClick={(e) => e.stopPropagation()} className={formContent}>
      <section className={formInner}>
        <div className={paHeader}>
          <div className={paHeaderTitle}>Cover settings</div>
          <div onClick={clickCloseHandler} className={paHeaderClose}>
            {/* <Close /> */}
          </div>
        </div>

        <div className={paPreview}>
          <div className={paPreviewInfo}>
            {/* <Image /> */}
            <div>Drop your image here</div>
          </div>
          <input
            onChange={handleChange}
            className={paPreviewInput}
            type="file"
            accept="image/gif,image/jpeg,image/png"
          />
          <img
            className={paPreviewImg}
            alt="none"
            src={image.imageUrl ? image.imageUrl : process.env.DASHBOARD_NULL}
          ></img>
        </div>

        <LinearProgress
          variant="determinate"
          sx={{ backgroundColor: 'transparent' }}
          value={progress}
        />

        <div className={paInfo}>
          <div className={paInfoItem}>
            <span>Supported formats</span>
            <span>JPEG / PNG / GIF</span>
          </div>
          <div className={paInfoItem}>
            <span>Maximum file size</span>
            <span> joke about mom... </span>
          </div>
          <div className={paInfoItem}>
            <span>Maximum resolution</span>
            <span>4096 × 4096</span>
          </div>
          <div className={paInfoItem}>
            <span>Recommended aspect ratio</span>
            <span>1:4</span>
          </div>
        </div>

        <div className={paSubmit}>
          <div
            onClick={clickUploadHandler}
            className={cn(paSubmitUpload, {
              [paSubmitUploadActive]: verifyImage(),
            })}
          >
            Upload
          </div>
          <div onClick={clickCloseHandler} className={paSubmitClose}>
            Close
          </div>
        </div>
      </section>
    </form>
  )
}

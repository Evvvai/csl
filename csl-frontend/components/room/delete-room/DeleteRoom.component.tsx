import React, { FC, useState } from 'react'
import cn from 'classnames'

// Styles
import styles from './DeleteRoom.module.scss'
const {
  formContent,
  formInner,
  paHeader,
  paHeaderTitle,
  paHeaderClose,
  paSubmit,
  paSubmitAgree,
  paSubmitClose,
  paInfo,
  hrH,
} = styles

// Components

// Custom Hooks

// Utils

// Interface
interface Props {
  handleClickLeave: any
  setOpen: any
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export default function DeleteRoom(props: Props): JSX.Element {
  const handleClickClose = () => props.setOpen(false)

  return (
    <form onClick={(e) => e.stopPropagation()} className={formContent}>
      <section className={formInner}>
        <div className={paHeader}>
          <div className={paHeaderTitle}>
            Are you sure you want to delete a room
          </div>
          <div className={paHeaderClose}>{/* <Close /> */}</div>
        </div>
        <hr className={hrH} />
        <div className={paInfo}>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;Since you are the leader of the squad, after
            you leave the squad will be disbanded, if you want to leave the
            group and not disband the squad, pass the role of leader to another
            player before you leave
          </p>
        </div>
        <div onClick={handleClickClose} className={paSubmit}>
          <div className={paSubmitAgree} onClick={props.handleClickLeave}>
            Agree
          </div>
          <div className={paSubmitClose}>Close</div>
        </div>
      </section>
    </form>
  )
}

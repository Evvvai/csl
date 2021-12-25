import React, { Fragment, useState } from 'react'

// Styles
import styles from './Setting.module.scss'
const {
  setting,
  title,
  hrH,
  Active,
  settingContent,
  settingItem,
  tip,
  Enable,
} = styles

// Components
import ToolTip from '../../UI/Tooltip/Tooltip.component'
import { RiWirelessChargingFill } from 'react-icons/ri'
import { GiCombinationLock } from 'react-icons/gi'

// Custom hooks

// Utils
import cn from 'classnames'

interface Props {
  setOpen: any
  isOpen: any
}

///////////////////////////////////////////////////////////////////////////////////////////
export default function Setting(props: Props): JSX.Element {
  const [isPublic, setIsPublic] = useState<boolean>(false) // Hardcode must rework
  const [isSearch, setIsSearch] = useState<boolean>(false) // Hardcode must rework

  const handleClickSearch = (e: any) => {
    setIsPublic(!isPublic)
  }

  const handleClickPermission = (e: any) => {
    setIsSearch(!isSearch)
  }

  return (
    <div className={cn(setting, { [Active]: props.isOpen })}>
      <div className={title}>
        <span>Settings</span>
        <hr className={hrH} />
      </div>
      <div className={settingContent}>
        <ToolTip
          content={
            <div className={tip}>
              <span>{isPublic ? 'Disable' : 'Enable'} global search</span>
            </div>
          }
          reset={50}
          delay={350}
          placement={'top'}
        >
          <div
            onClick={handleClickSearch}
            className={cn(settingItem, { [Enable]: isPublic })}
          >
            <RiWirelessChargingFill />
          </div>
        </ToolTip>
        <ToolTip
          content={
            <div className={tip}>
              <span>{isSearch ? 'Disable' : 'Enable'} global search</span>
            </div>
          }
          reset={50}
          delay={350}
          placement={'top'}
        >
          <div
            onClick={handleClickPermission}
            className={cn(settingItem, { [Enable]: isSearch })}
          >
            <GiCombinationLock />
          </div>
        </ToolTip>
      </div>
    </div>
  )
}

import React, { Fragment, memo } from 'react'

// Styles
import styles from './Footer.module.scss'
const { footer, footerContent, footerItem } = styles

// Components
import Icon from 'components/icon/Icon.component'
import FooterWaveIcon from '../../assets/icon/FooterWave.svg'

// Utils

///////////////////////////////////////////////////////////////////////////////////////////
export default function Footer(): JSX.Element {
  return (
    <footer className={footer}>
      {/* <Icon asset={'FooterWave'} /> */}
      <FooterWaveIcon />
      <div className={footerContent}>
        <a className={footerItem}>Company</a>
        <span>|</span>
        <a className={footerItem}>Marketing Services</a>
        <span>|</span>
        <a className={footerItem}>Support</a>
        <span>|</span>
        <a className={footerItem}>Terms of Service</a>
        <span>|</span>
        <a className={footerItem}>Privacy Policy</a>
      </div>
    </footer>
  )
}

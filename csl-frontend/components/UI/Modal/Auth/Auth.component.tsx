import { FC, useCallback, useRef, useState } from 'react'
// import style from './AuthModal.module.module.scss'

// Style
// const {} = style

// Components
import Modal from '../Modal.component'
import AuthLayout from 'components/layouts/Auth.layout'

// Utils

// Interface
interface Props {
  isOpen: any
  setOpen: any
}

type AuthSection = 'SignIn' | 'SignUp'

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export default function AuthModal(props: Props): JSX.Element {
  const [section, setSection] = useState<AuthSection>('SignIn')
  const [outerIsLock, setOuterIsLock] = useState<boolean>(false)

  return (
    <AuthLayout isOpen={props.isOpen} isLock={outerIsLock}>
      <Modal
        isOpen={props.isOpen}
        setOpen={props.setOpen}
        setOuterIsLock={setOuterIsLock}
      >
        <div>{section === 'SignIn' ? <div /> : <div />}</div>
      </Modal>
    </AuthLayout>
  )
}

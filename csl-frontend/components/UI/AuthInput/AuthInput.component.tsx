import { useRef, useState } from 'react'
import style from './AuthInput.module.scss'

// Style
const { formGroup, formGroup__input, formGroup__label, Error } = style

// Utils
import cn from 'classnames'

// Interface
interface Props {
  label: string
  model: {
    value: string | number
    setValue: any
  }
  type: typeInput
  name: nameInput
  autoComplete?: autoCompleteInput
  isError?: boolean
}

type typeInput = 'password' | 'text' | 'email'
type nameInput =
  | 'username'
  | 'password'
  | 'new-password'
  | 'password-confirm'
  | 'email'
type autoCompleteInput = 'username' | 'new-password' | 'password' | 'email'

// Component
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export default function AuthInput(props: Props): JSX.Element {
  return (
    <div className={formGroup}>
      <label className={formGroup__label}>{props.label}</label>
      <input
        className={cn(formGroup__input, { [Error]: props?.isError })}
        value={props.model.value}
        onChange={(e) => props.model.setValue(e.target.value)}
        type={props.type}
        name={props.name}
        autoComplete={props?.autoComplete}
      />
    </div>
  )
}

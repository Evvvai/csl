import { useEffect, useRef, useState } from 'react'
import style from './MyInput.module.scss'

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
  callback?: any
  debounce?: number
}

type typeInput = 'password' | 'text' | 'email'
type nameInput =
  | 'username'
  | 'password'
  | 'new-password'
  | 'password-confirm'
  | 'email'
  | 'search'
type autoCompleteInput = 'username' | 'new-password' | 'password' | 'email'

// Component
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export default function MyInput(props: Props): JSX.Element {
  /**
   * Need implement debounce
   */
  useEffect(() => {
    props.callback(props.model.value)
  }, [props.model.value])

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

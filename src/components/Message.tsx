
import React from 'react'
import { IconType } from 'react-icons'

export const Message = ({ PrefixIconComponent, message }: {PrefixIconComponent: IconType, message: string}) => {
  return (
    <p style={{ fontSize: '1.5em', marginLeft: '1rem' }}>
        <PrefixIconComponent /> {message}
    </p>
  )
}

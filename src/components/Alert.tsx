/* eslint-disable no-use-before-define */
import React, { useContext } from 'react'
import { Alert } from 'react-bootstrap'
import { AlertContext } from '../screens/VoteScreen'

export const CustomAlert: React.VFC = () => {
  const { message, isOpen } = useContext(AlertContext)

  return (
    isOpen
      ? (
      <Alert variant='danger'>
        {message}
      </Alert>
        )
      : <></>
  )
}

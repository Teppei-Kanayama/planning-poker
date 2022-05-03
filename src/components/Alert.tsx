/* eslint-disable no-use-before-define */
import React, { useContext } from 'react'
import { Alert } from 'react-bootstrap'
import { AlertContext } from '../screens/VoteScreen'

export const CustomAlert: React.VFC = () => {
  const { alertType } = useContext(AlertContext)
  if (alertType === 'OtherErrors') {
    return (
      <Alert variant='danger'>
        エラーが発生しました。操作をやり直してください。
      </Alert>
    )
  }
  return <></>
}

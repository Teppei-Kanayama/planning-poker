import React from 'react'
import { Alert } from 'react-bootstrap'
import { useAlertContext } from '../hooks/alert'

export const CustomAlert: React.VFC = () => {
  const { alertType } = useAlertContext()
  if (alertType === 'OtherErrors') {
    return (
      <Alert variant='danger'>
        エラーが発生しました。操作をやり直してください。
      </Alert>
    )
  }
  return <></>
}

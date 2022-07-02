import React from 'react'
import Button from 'react-bootstrap/Button'

import { useAlertContext } from '../hooks/alert'
import { deleteAllVotes } from '../data/firebase'

export const ResetButton = ({ roomId }: {roomId: string}) => {
  const { setAlert, resetAlert } = useAlertContext()

  const handleClick = async () => {
    await deleteAllVotes(roomId, setAlert, resetAlert)
  }

  return (
    <Button onClick={handleClick} variant='danger' style={{ marginLeft: '1rem', marginBottom: '1rem', display: 'flex' }}>
      全員の投票をリセット
    </Button>
  )
}

import React from 'react'
import Button from 'react-bootstrap/Button'

import { useAlertContext } from '../hooks/alert'
import { signOut, deleteAllVotes } from '../data/firebase'

export const VoteButton = (props: {onClick?: () => void, disabled?: boolean}) => {
  return (
    <Button {...props} variant='primary' style={{ marginLeft: '1rem', marginBottom: '1rem', display: 'flex' }}>
      投票
    </Button>
  )
}

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

export const SignOutButton = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Button
        onClick={
          () => {
            signOut()
            location.reload()
          }
        }
        variant="light"
        style={{ marginLeft: 'auto' }}>
      サインアウト
      </Button>
    </div>
  )
}

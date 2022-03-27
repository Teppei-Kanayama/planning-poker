/* eslint-disable no-use-before-define */
import React from 'react'
import Button from 'react-bootstrap/Button'
import { signOut } from '../data/firebase'

export const VoteButton = (props: {onClick?: () => void, disabled?: boolean}) => {
  return (
    <Button {...props} variant='primary' style={{ marginLeft: '1rem', marginBottom: '1rem', display: 'flex' }}>
      投票
    </Button>
  )
}

export const ResetButton = (props: {onClick?: () => void, disabled?: boolean}) => {
  return (
    <Button {...props} variant='danger' style={{ marginLeft: '1rem', marginBottom: '1rem', display: 'flex' }}>
      全員の投票をリセット
    </Button>
  )
}

export const SignOutButton = () => {
  return (
      <div style={{ display: 'flex' }}>
        <Button onClick={signOut} variant="light" style={{ marginLeft: 'auto' }}> サインアウト</Button>
      </div>
  )
}

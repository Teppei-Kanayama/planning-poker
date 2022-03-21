/* eslint-disable no-use-before-define */
import React from 'react'
import Button from 'react-bootstrap/Button'

export const VoteButton = (props: {onClick?: () => void, disabled?: boolean}) => {
  return (
    <Button {...props} variant='primary' style={{ marginLeft: '1rem' }}>
      投票
    </Button>
  )
}

export const ResetButton = (props: {onClick?: () => void, disabled?: boolean}) => {
  return (
    <Button {...props} variant='danger'>
      全員の投票をリセット
    </Button>
  )
}

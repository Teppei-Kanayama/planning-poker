/* eslint-disable no-use-before-define */
import React from 'react'

export const VoteButton = (props: {onClick?: () => void, disabled?: boolean}) => {
  return (
    <button {...props}>
      投票
    </button>
  )
}

export const ResetButton = (props: {onClick?: () => void, disabled?: boolean}) => {
  return (
    <button {...props}>
      全員の投票をリセット
    </button>
  )
}

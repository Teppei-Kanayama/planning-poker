/* eslint-disable no-use-before-define */
import React from 'react'

export const VoteButton = (props: {onClick?: () => void, disabled?: boolean}) => {
  return (
    <button {...props}>
          投票
    </button>
  )
}

/* eslint-disable no-use-before-define */
import React from 'react'
import { Vote } from '../types'
import { VoteCards } from './Cards'

export const VoteResult = ({ votes }: {votes: Vote[]}) => {
  const points = votes.map((vote) => vote.point)
  return (
    <>
      <VoteCards points={points} disabled/>
    </>
  )
}

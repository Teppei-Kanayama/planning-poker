/* eslint-disable no-use-before-define */
import React from 'react'
import { Vote } from '../types'
import { VoteCards } from './Cards'
import { UserIcon } from './UserIcon'

export const VoteResult = ({ votes }: {votes: Vote[]}) => {
  const points = votes.map((vote) => vote.point)
  return (
    <>
      <div style={{ display: 'flex', marginLeft: '1rem' }}>
        {
          votes.map((vote) => {
            return <UserIcon key={vote.user.id} user={vote.user} style={{ height: '3rem', marginLeft: '0.5rem', marginRight: '0.5rem' }}/>
          })
        }
      </div>
      <VoteCards points={points} disabled/>
    </>
  )
}

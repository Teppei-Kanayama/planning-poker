/* eslint-disable no-use-before-define */
import React from 'react'
import { MdAccountCircle } from 'react-icons/md'
import ReactTooltip from 'react-tooltip'
import { Vote } from '../types'
import { VoteCards } from './Cards'

export const VoteResult = ({ votes }: {votes: Vote[]}) => {
  const points = votes.map((vote) => vote.point)
  return (
    <>
      <div style={{ display: 'flex', marginLeft: '1rem', fontSize: '1.5em' }}>
        {
          votes.map((vote) => {
            const user = vote.user
            const style = { height: '3rem', marginLeft: '0.5rem', marginRight: '0.5rem' }
            if (user.iconUrl == null) {
              return <MdAccountCircle key={user.id} style={style}/>
            }
            return (
              <div key={user.id}>
              <img src={user.iconUrl} style={style} data-tip={user.name}/>
              <ReactTooltip />
              </div>
            )
          })
        }
      </div>
      <VoteCards points={points} disabled/>
    </>
  )
}

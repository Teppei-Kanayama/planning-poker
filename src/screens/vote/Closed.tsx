/* eslint-disable no-use-before-define */
import React from 'react'

import { deleteAllVotes } from '../../data/firebase'
import { FibonacciCards, VoteCards } from '../../components/Cards'
import { ResetButton, VoteButton } from '../../components/Button'
import { useAllVotes, useMyPoint } from '../../hooks/points'
import { Room, User } from '../../types'
import { UserIcon } from '../../components/UserIcon'

export const Closed = ({ room, user }: {room: Room, user: User}) => {
  const [myPoint] = useMyPoint(room.id, user.id)
  const [votes] = useAllVotes(room.id)
  const points = votes.map((vote) => vote.point)

  const onClickResetAllVotes = async () => {
    await deleteAllVotes(room.id)
  }

  const getMessage = () => {
    if (votes.length === 0) {
      return ''
    }
    const maxPoint = Math.max(...points)
    const minPoint = Math.min(...points)
    if (maxPoint === minPoint) {
      return '【投票結果】 全員一致 🎉'
    }
    return `【投票結果】 まずは${minPoint}ポイントに投票した人に話を聞いてみましょう！`
  }

  return (
    <>
      <FibonacciCards disabled myPoint={myPoint} showWallaby={true}/>
      <VoteButton disabled />
      <p style={{ fontSize: '1.5em', marginLeft: '1rem' }}>
        {getMessage()}
      </p>
      <div style={{ display: 'flex', marginLeft: '1rem' }}>
        {
          votes.map((vote) => {
            return <UserIcon key={vote.user.id} user={vote.user} style={{ height: '3rem', marginLeft: '0.5rem', marginRight: '0.5rem' }}/>
          })
        }
      </div>
      <VoteCards points={points} disabled/>
      <ResetButton onClick={onClickResetAllVotes} />
    </>
  )
}

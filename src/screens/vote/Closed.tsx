import React from 'react'

import { FibonacciCards, VoteCards } from '../../components/Cards'
import { ResetButton } from '../../components/Button'
import { useAllVotes, useMyPoint } from '../../hooks/votes'
import { Room, User } from '../../types'
import { UserIcon } from '../../components/UserIcon'

export const Closed = ({ room, user }: {room: Room, user: User}) => {
  const [myPoint] = useMyPoint(room.id, user.id)
  const [votes] = useAllVotes(room.id)
  const points = votes.map((vote) => vote.point)

  const getMessage = () => {
    if (votes.length === 0) {
      return ''
    }
    let maxPoint = -Infinity
    let minPoint = Infinity
    let minPointUser = votes[0].user
    votes.forEach((vote) => {
      if (vote.point > maxPoint) {
        maxPoint = vote.point
      }
      if (vote.point < minPoint) {
        minPoint = vote.point
        minPointUser = vote.user
      }
    })

    if (maxPoint === minPoint) {
      return '【投票結果】 全員一致 🎉'
    }
    return `【投票結果】 まずは${minPointUser.name}さんに話を聞いてみましょう！`
  }

  return (
    <>
      <FibonacciCards disabled myPoint={myPoint} showWallaby={true}/>
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
      <ResetButton roomId={room.id} />
    </>
  )
}

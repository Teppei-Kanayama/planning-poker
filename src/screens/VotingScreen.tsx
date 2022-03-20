/* eslint-disable no-use-before-define */
import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { addVote, deleteVote, deleteAllVotes } from '../firebase/firebase'
import { v4 as uuidv4 } from 'uuid'

const getUserId = () => {
  let userId: string
  const storedUserId = localStorage.getItem('userId')
  if (storedUserId == null) {
    userId = uuidv4()
    localStorage.setItem('userId', userId)
  } else {
    userId = storedUserId
  }
  return userId
}

const VoteCard = ({ point, onClick }: {point: number, onClick: (p: number) => void}) => {
  return (
    <button onClick={() => { onClick(point) }}>{point}</button>
  )
}

const fibonacci = [0, 1, 2, 3, 5, 8, 13, 21]

export const VotingScreen = () => {
  const [point, setPoint] = useState<number>()
  const [searchParams] = useSearchParams()
  const roomId = searchParams.get('id')
  const roomSize = searchParams.get('size')

  if (roomId == null || roomSize == null) {
    return (
      <h1>
        URLが不正です。roomIdとroomSizeを指定してください。
      </h1>
    )
  }

  const userId = getUserId()

  const onClickResetAllVotes = async () => {
    await deleteAllVotes(roomId)
  }

  const onClickVote = async () => {
    if (point != null) {
      await addVote(roomId, userId, point)
    }
  }

  const onClickCancelVote = async () => {
    await deleteVote(roomId, userId)
  }

  const onClickVoteCard = (p: number) => {
    setPoint(p)
  }

  return (
    <>
      <button onClick={onClickResetAllVotes}>
          全員の投票をリセット
      </button>
      <h1>
        { `あなたのuserIdは${userId}、roomIdは${roomId}、roomSizeは${roomSize}です、pointは${point}です` }
      </h1>
      {
        fibonacci.map((i) => {
          return (
            <VoteCard
              key={i}
              point={i}
              onClick={onClickVoteCard}
            />
          )
        })
      }
      <br />
      <button onClick={onClickVote} disabled={point == null}>
          投票
      </button>
      <button onClick={onClickCancelVote}>
          投票取り下げ
      </button>
    </>
  )
}

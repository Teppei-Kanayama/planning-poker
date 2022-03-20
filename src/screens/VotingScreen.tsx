/* eslint-disable no-use-before-define */
import React from 'react'
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

export const VotingScreen = () => {
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
    await addVote(roomId, userId, 3)
  }

  const onClickCancelVote = async () => {
    await deleteVote(roomId, userId)
  }

  return (
    <>
      <button onClick={onClickResetAllVotes}>
          全員の投票をリセット
      </button>
      <h1>
        { `あなたのuserIdは${userId}、roomIdは${roomId}、roomSizeは${roomSize}です` }
      </h1>
      <button onClick={onClickVote}>
          投票
      </button>
      <button onClick={onClickCancelVote}>
          投票取り下げ
      </button>
    </>
  )
}

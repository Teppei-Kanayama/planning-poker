/* eslint-disable no-use-before-define */
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { vote } from '../firebase/firebase'
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
  const userId = getUserId()

  if (roomId == null || roomSize == null) {
    return (
      <h1>
        URLが不正です。roomIdとroomSizeを指定してください。
      </h1>
    )
  }

  return (
    <>
      <h1>
        { `あなたのuserIdは${userId}、roomIdは${roomId}、roomSizeは${roomSize}です` }
      </h1>
      <button onClick={async () => {
        await vote(roomId, userId, 3)
      }}>
          送信
      </button>
    </>
  )
}

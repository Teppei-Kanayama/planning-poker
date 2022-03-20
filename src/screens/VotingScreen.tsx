/* eslint-disable no-use-before-define */
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { vote } from '../firebase/firebase'

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

  return (
    <>
      <h1>
        { `あなたのroomIdは${roomId}、roomSizeは${roomSize}です` }
      </h1>
      <button onClick={async () => {
        await vote(roomId, 3)
      }}>
          送信
      </button>
    </>
  )
}

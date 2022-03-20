/* eslint-disable no-use-before-define */
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { vote } from '../firebase/firebase'

export const VotingScreen = () => {
  const [searchParams] = useSearchParams()

  const roomId = searchParams.get('id')
  const roomSize = searchParams.get('size')

  return (
    <div className="App">
      <h1>
        { `あなたのroomIdは${roomId}、roomSizeは${roomSize}です` }
      </h1>
      <button onClick={async () => {
        await vote()
      }}>
          送信
      </button>
    </div>
  )
}

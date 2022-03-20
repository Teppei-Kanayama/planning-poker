/* eslint-disable no-use-before-define */
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { vote } from '../firebase/firebase'

export const VotingScreen = () => {
  const [searchParams] = useSearchParams()

  const roomId = searchParams.get('id')
  console.log(roomId)
  const roomSize = searchParams.get('size')
  console.log(roomSize)

  return (
    <div className="App">
      <h1>
        <button onClick={async () => {
          await vote()
        }}>
          送信
        </button>
      </h1>
    </div>
  )
}

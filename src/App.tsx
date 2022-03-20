/* eslint-disable no-use-before-define */
import React from 'react'
import './App.css'
import { Routes, Route, useSearchParams } from 'react-router-dom'
import { vote } from './firebase/firebase'

const VotingScreen = () => {
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

const SetupScreen = () => {
  return (
    <div className="App">
      <h1>新しい部屋を作成しよう！</h1>
    </div>
  )
}

function App () {
  return (
    <>
      <Routes>
        <Route path="/" element={<SetupScreen />} />
        <Route path="/create-new-room" element={<SetupScreen />} />
        <Route path="/room" element={<VotingScreen />} />
      </Routes>
    </>
  )
}

export default App

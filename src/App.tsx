/* eslint-disable no-use-before-define */
import React from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import { vote } from './firebase/firebase'

const VotingScreen = () => {
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

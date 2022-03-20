/* eslint-disable no-use-before-define */
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { SetupScreen } from './screens/SetupScreen'
import { VotingScreen } from './screens/VotingScreen'

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

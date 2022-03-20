/* eslint-disable no-use-before-define */
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SetupScreen } from './screens/SetupScreen'
import { VotingScreen } from './screens/VotingScreen'

function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/create-new-room" element={<SetupScreen />} />
        <Route path="/room" element={<VotingScreen />} />
        <Route path="/" element={<SetupScreen />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

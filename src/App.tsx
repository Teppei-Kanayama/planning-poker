import React from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'

import { SetupScreen } from './screens/SetupScreen'
import { VoteScreen } from './screens/VoteScreen'
import { HomeScreen } from './screens/HomeScreen'
import { LoadingScreen } from './screens/LoadingScreen'
import { useSignIn } from './hooks/firebase'

function App () {
  const [user, isLoading] = useSignIn()

  if (isLoading) {
    return <LoadingScreen />
  }

  if (user == null) {
    return <HomeScreen user={null} />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen user={user} />} />
        <Route path="/create-new-room" element={<SetupScreen />} />
        <Route path="/room" element={<VoteScreen user={user}/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

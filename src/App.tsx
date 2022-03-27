/* eslint-disable no-use-before-define */
import React from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'

import { SetupScreen } from './screens/SetupScreen'
import { VotingScreen } from './screens/VotingScreen'
import { SignInScreen } from './screens/SignInScreen'
import { useSignIn } from './hooks/firebase'
import ReactLoading from 'react-loading'

function App () {
  const [isSignedIn, isLoading] = useSignIn()

  if (isLoading) {
    return (
    <div style={{
      marginTop: '20rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <ReactLoading type="spokes" color="#0000FF" height={200} width={100} />
      </div>
    )
  }

  if (!isSignedIn) {
    return <SignInScreen/>
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SetupScreen />} />
        <Route path="/create-new-room" element={<SetupScreen />} />
        <Route path="/room" element={<VotingScreen />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

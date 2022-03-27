/* eslint-disable no-use-before-define */
import React from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'

import { SetupScreen } from './screens/SetupScreen'
import { VotingScreen } from './screens/VotingScreen'
// import { SignInScreen } from './screens/SignInScreen'
import { useSignIn } from './hooks/firebase'
import ReactLoading from 'react-loading'

const style = {
  marginTop: '20rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

function App () {
  const [isSignedIn] = useSignIn()

  if (!isSignedIn) {
    // return <SignInScreen/>
    return (<div style={style}><ReactLoading type="spokes" color="#0000FF" height={200} width={100} /></div>)
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

/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { SetupScreen } from './screens/SetupScreen'
import { VotingScreen } from './screens/VotingScreen'

import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import { firebaseKeys } from './data/constants'
import { SignInScreen } from './screens/SignInScreen'

firebase.initializeApp(firebaseKeys)

function App () {
  const [isSignedIn, setIsSignedIn] = useState(false) // Local signed-in state.

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      setIsSignedIn(!!user)
    })
    return () => unregisterAuthObserver() // Make sure we un-register Firebase observers when the component unmounts.
  }, [])

  if (!isSignedIn) {
    return <SignInScreen/>
  }
  return (
    <Routes>
      <Route path="/" element={<SetupScreen />} />
      <Route path="/create-new-room" element={<SetupScreen />} />
      <Route path="/room" element={<VotingScreen />} />
    </Routes>
  )
}

export default App

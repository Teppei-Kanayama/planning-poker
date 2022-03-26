/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { SetupScreen } from './screens/SetupScreen'
import { VotingScreen } from './screens/VotingScreen'

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import { firebaseKeys } from './data/constants'

firebase.initializeApp(firebaseKeys)

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false
  }
}

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
    return (
      <div>
        <h1>My App</h1>
        <p>Please sign-in:</p>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
      </div>
    )
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

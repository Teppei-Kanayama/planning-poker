import React from 'react'

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false
  }
}

export const SignInScreen = () => {
  return (
    <div>
        <h1 style={{ marginLeft: '1rem', marginBottom: '1rem', marginTop: '1rem' }}>Planning Pokerアプリ by wallaby</h1>
        <p style={{ marginLeft: '1rem', marginBottom: '3rem', marginTop: '1rem' }}>Googleアカウントでサインインしてください</p>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
      </div>
  )
}

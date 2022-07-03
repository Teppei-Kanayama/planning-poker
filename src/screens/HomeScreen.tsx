import React from 'react'

import Image from 'react-bootstrap/Image'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import { User } from '../types'
import { NavigationBar } from '../components/NavigationBar'

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

export const HomeScreen = ({ user }: {user: User | null}) => {
  console.log(user)
  return (
    <div>
      <NavigationBar />
      <p style={{ margin: '2rem' }}>オンラインでPlanning PokerをするためのWebアプリです。Googleアカウントがあれば誰でも使えます。</p>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <Image className="border border-5 rounded border-success" src='screenshot.png' alt='screenshot of the application' fluid />
      </div>
    </div>
  )
}

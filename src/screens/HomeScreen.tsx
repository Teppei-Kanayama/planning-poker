import React from 'react'

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import { User } from '../types'
import { NavigationBar } from './components/NavigationBar'
import { Button } from 'react-bootstrap'

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
  return (
    <div>
      <NavigationBar isSignedIn={ user != null }/>
      <p style={{ margin: '2rem' }}>Planning PokerのためのWebアプリです。Googleアカウントがあれば誰でも利用できます。不具合報告や要望などは<a href='https://twitter.com/tkanayama_'>@tkanayama</a>までお願いします。</p>
      {
        user
          ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
            href={'/create-new-room'}
            style={{ display: 'flex', justifyContent: 'center', padding: '0.5rem', marginLeft: '3rem' }}
            >
              投票所を新規作成する
            </Button>
          </div>
            )
          : (
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
            )
      }
    </div>
  )
}

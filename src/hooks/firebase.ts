/* eslint-disable no-use-before-define */
import { useEffect, useState } from 'react'

import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import { firebaseKeys } from '../data/constants'

firebase.initializeApp(firebaseKeys)

export const useSignIn = () => {
  const [isSignedIn, setIsSignedIn] = useState(false) // Local signed-in state.

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      setIsSignedIn(!!user)
    })
    return () => unregisterAuthObserver() // Make sure we un-register Firebase observers when the component unmounts.
  }, [])

  return [isSignedIn]
}

/* eslint-disable no-use-before-define */
import { useEffect, useState } from 'react'

import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import { firebaseKeys } from '../data/constants'

firebase.initializeApp(firebaseKeys)

export const useSignIn = () => {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      setIsSignedIn(!!user)
      setIsLoading(false)
    })
    return () => unregisterAuthObserver() // Make sure we un-register Firebase observers when the component unmounts.
  }, [])

  return [isSignedIn, isLoading]
}

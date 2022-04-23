/* eslint-disable no-use-before-define */
import { useEffect, useState } from 'react'

import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import { firebaseKeys } from '../data/constants'

firebase.initializeApp(firebaseKeys)

export const useSignIn = () => {
  const [userId, setUserId] = useState<string>()
  const [photoUrl, setPhotoUrl] = useState<string>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      if (user != null) {
        setUserId(user.uid)
        setPhotoUrl(user.photoURL || '')
      }
      setIsLoading(false)
    })
    return () => unregisterAuthObserver() // Make sure we un-register Firebase observers when the component unmounts.
  }, [])

  return [userId, photoUrl, isLoading] as const
}

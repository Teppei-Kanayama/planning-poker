/* eslint-disable no-use-before-define */
import { useEffect, useState } from 'react'

import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import { firebaseKeys } from '../data/constants'
import { User } from '../types'

firebase.initializeApp(firebaseKeys)

export const useSignIn = () => {
  const [user, setUser] = useState<User>()
  const [userId, setUserId] = useState<string>()
  const [photoUrl, setPhotoUrl] = useState<string>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(u => {
      if (u != null) {
        console.log(u)
        setUser({ id: u.uid, name: u.displayName, iconUrl: u.photoURL })
        setUserId(u.uid)
        setPhotoUrl(u.photoURL || '')
      }
      setIsLoading(false)
    })
    return () => unregisterAuthObserver() // Make sure we un-register Firebase observers when the component unmounts.
  }, [])

  console.log(user)
  return [userId, photoUrl, isLoading] as const
}

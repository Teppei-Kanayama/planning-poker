import { useEffect, useState } from 'react'

import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import { firebaseKeys } from '../data/constants'
import { User } from '../types'

firebase.initializeApp(firebaseKeys)

export const useSignIn = () => {
  const [user, setUser] = useState<User>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(u => {
      if (u != null) {
        setUser({ id: u.uid, name: u.displayName, iconUrl: u.photoURL })
      }
      setIsLoading(false)
    })
    return () => unregisterAuthObserver() // Make sure we un-register Firebase observers when the component unmounts.
  }, [])

  return [user, isLoading] as const
}

// Initialize Cloud Firestore through Firebase
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, query, where, getDocs, deleteDoc, setDoc, doc, getDoc, onSnapshot, QuerySnapshot, DocumentData, orderBy } from 'firebase/firestore'
import firebase from 'firebase/compat/app'

import { firebaseKeys } from './constants'
import { User, Vote } from '../types'

initializeApp(firebaseKeys)

const db = getFirestore()

const getDocName = (roomId:string, userId: string) => {
  return roomId + userId
}

export const signOut = () => firebase.auth().signOut()

export const subscribeCollection = (callback: (doc: QuerySnapshot<DocumentData>) => void) => {
  return onSnapshot(collection(db, 'points'), callback)
}

export const findVote = async (roomId: string, userId: string) => {
  const docName = getDocName(roomId, userId)
  const ref = doc(db, 'points', docName)
  const docSnapshot = await getDoc(ref)
  return docSnapshot.data()
}

export const addVote = async (roomId: string, user: User, point: number) => {
  try {
    const docName = getDocName(roomId, user.id)
    const ref = doc(db, 'points', docName)
    await setDoc(ref, {
      roomId: roomId,
      point: point,
      userId: user.id,
      userIconUrl: user.iconUrl,
      userName: user.name
    })
  } catch (e) {
    // TODO: エラーハンドリング
    console.error('Error adding document: ', e)
  }
}

export const fetchAllVotes = async (roomId: string) => {
  const ref = query(collection(db, 'points'), where('roomId', '==', roomId), orderBy('point'))
  const querySnapshot = await getDocs(ref)
  const points: Vote[] = []
  querySnapshot.forEach((doc) => {
    const data = doc.data()
    points.push({ point: data.point, user: { id: data.userId, iconUrl: data.userIconUrl, name: data.userName } })
  })
  return points
}

export const deleteAllVotes = async (roomId: string) => {
  const ref = query(collection(db, 'points'), where('roomId', '==', roomId))
  const querySnapshot = await getDocs(ref)
  querySnapshot.forEach(
    (doc) => {
      deleteDoc(doc.ref)
    }
  )
}

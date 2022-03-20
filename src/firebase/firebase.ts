// Initialize Cloud Firestore through Firebase
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc } from 'firebase/firestore'
import { firebaseKeys } from './constants'

initializeApp(firebaseKeys)

const db = getFirestore()

export const vote = async (roomId: string, point: number) => {
  try {
    const docRef = await addDoc(collection(db, 'points'), {
      roomId: roomId,
      point: point
    })
    console.log('Document written with ID: ', docRef.id)
  } catch (e) {
    // TODO: エラーハンドリング
    console.error('Error adding document: ', e)
  }
}

export const cancelVote = () => {}

export const resetAllVotes = () => {}

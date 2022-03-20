// Initialize Cloud Firestore through Firebase
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, query, where, getDocs, deleteDoc } from 'firebase/firestore'
import { firebaseKeys } from './constants'

initializeApp(firebaseKeys)

const db = getFirestore()

export const vote = async (roomId: string, userId: string, point: number) => {
  try {
    await addDoc(collection(db, 'points'), {
      roomId: roomId,
      userId: userId,
      point: point
    })
  } catch (e) {
    // TODO: エラーハンドリング
    console.error('Error adding document: ', e)
  }
}

export const cancelVote = async (roomId: string, userId: string) => {
  const ref = query(collection(db, 'points'), where('userId', '==', userId), where('roomId', '==', roomId))
  const querySnapshot = await getDocs(ref)
  querySnapshot.forEach(
    (doc) => {
      deleteDoc(doc.ref)
    }
  )
}

export const resetAllVotes = (roomId: string) => {
  console.log(roomId)
}

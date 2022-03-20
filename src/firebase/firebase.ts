// Initialize Cloud Firestore through Firebase
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, query, where, getDocs, deleteDoc, setDoc, doc } from 'firebase/firestore'
import { firebaseKeys } from './constants'

initializeApp(firebaseKeys)

const db = getFirestore()

// export const findVote = async (roomId: string, userId: string) => {
//   const ref = query(collection(db, 'points'), where('userId', '==', userId), where('roomId', '==', roomId))
//   const querySnapshot = await getDocs(ref)
// }

const getDocName = (roomId:string, userId: string) => {
  return roomId + userId
}

export const addVote = async (roomId: string, userId: string, point: number) => {
  try {
    const docName = getDocName(roomId, userId)
    const ref = doc(db, 'points', docName)
    await setDoc(ref, {
      roomId: roomId,
      userId: userId,
      point: point
    })
  } catch (e) {
    // TODO: エラーハンドリング
    console.error('Error adding document: ', e)
  }
}

export const deleteVote = async (roomId: string, userId: string) => {
  const ref = query(collection(db, 'points'), where('userId', '==', userId), where('roomId', '==', roomId))
  const querySnapshot = await getDocs(ref)
  querySnapshot.forEach(
    (doc) => {
      deleteDoc(doc.ref)
    }
  )
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

// Initialize Cloud Firestore through Firebase
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, query, where, getDocs, deleteDoc, setDoc, doc, getDoc, onSnapshot, QuerySnapshot, DocumentData, orderBy, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore'
import firebase from 'firebase/compat/app'

import { firebaseKeys } from './constants'
import { User, Vote, VoteDocument } from '../types'

initializeApp(firebaseKeys)

const db = getFirestore()

const voteConverter: FirestoreDataConverter<VoteDocument> = {
  toFirestore (vote: VoteDocument): DocumentData {
    return {
      point: vote.point,
      roomId: vote.roomId,
      userIconUrl: vote.userIconUrl,
      userId: vote.userId,
      userName: vote.userName
    }
  },

  fromFirestore (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): VoteDocument {
    const data = snapshot.data(options)
    return {
      point: data.point,
      roomId: data.roomId,
      userIconUrl: data.userIconUrl,
      userId: data.userId,
      userName: data.userName
    }
  }
}

const getDocName = (roomId:string, userId: string) => {
  return roomId + userId
}

export const signOut = () => firebase.auth().signOut()

export const subscribeCollection = (callback: (doc: QuerySnapshot<DocumentData>) => void) => {
  return onSnapshot(collection(db, 'votes'), callback)
}

export const findVote = async (roomId: string, userId: string) => {
  const docName = getDocName(roomId, userId)
  const ref = doc(db, 'votes', docName).withConverter(voteConverter)
  const docSnapshot = await getDoc(ref)
  return docSnapshot.data()
}

export const addVote = async (roomId: string, user: User, point: number) => {
  try {
    const docName = getDocName(roomId, user.id)
    const ref = doc(db, 'votes', docName).withConverter(voteConverter)
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
  const ref = query(collection(db, 'votes'), where('roomId', '==', roomId), orderBy('point')).withConverter(voteConverter)
  const querySnapshot = await getDocs(ref)
  const votes: Vote[] = []
  querySnapshot.forEach((doc) => {
    const data = doc.data()
    votes.push({ point: data.point, user: { id: data.userId, iconUrl: data.userIconUrl, name: data.userName } })
  })
  return votes
}

export const deleteAllVotes = async (roomId: string) => {
  const ref = query(collection(db, 'votes'), where('roomId', '==', roomId)).withConverter(voteConverter)
  const querySnapshot = await getDocs(ref)
  querySnapshot.forEach(
    (doc) => {
      deleteDoc(doc.ref)
    }
  )
}

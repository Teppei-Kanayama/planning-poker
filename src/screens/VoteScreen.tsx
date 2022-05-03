/* eslint-disable no-use-before-define */
import React, { createContext, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { subscribeCollection } from '../data/firebase'
import { SignOutButton } from '../components/Button'
import { LoadingScreen } from './LoadingScreen'
import { Room, User } from '../types'
import { Closed } from './vote/Closed'
import { Voted } from './vote/Voted'
import { Voting } from './vote/Voting'
import { CustomAlert } from '../components/Alert'

type AlertType = 'OtherErrors' | null // TODO: ここにエラーの種類を足していく

type AlertContextType = {
  alertType: AlertType
  setAlertType: (alertType: AlertType) => void
}

export const AlertContext = createContext<AlertContextType>({ alertType: null, setAlertType: () => {} })

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alertType, setAlertType] = useState<AlertType>(null)

  return (
    <AlertContext.Provider value={{ alertType, setAlertType }}>
      {children}
    </AlertContext.Provider>
  )
}

const VoteRouter = ({ room, user }: {room: Room, user: User}) => {
  const [votedUsers, setVotedUsers] = useState<User[]>([])
  const [myVoteCount, setMyVoteCount] = useState<number>()
  const voteCount = votedUsers.length

  useEffect(
    () => {
      const unsubscribe = subscribeCollection(
        (querySnapshot) => {
          let myCount = 0
          const votedUsersArray: User[] = []
          querySnapshot.forEach(
            (doc) => {
              const data = doc.data()
              if (data.roomId === room.id) {
                votedUsersArray.push({ id: data.userId, iconUrl: data.userIconUrl, name: data.userName })
                if (data.userId === user.id) {
                  myCount += 1
                }
              }
            }
          )
          setVotedUsers(votedUsersArray)
          setMyVoteCount(myCount)
        }
      )
      return () => { unsubscribe() }
    }
    , [])

  if (voteCount == null || myVoteCount == null) {
    return <LoadingScreen />
  }
  if (voteCount >= room.size) {
    return <Closed room={room} user={user} />
  }
  if (myVoteCount >= 1) {
    return <Voted votedUsers={votedUsers} room={room} user={user}/>
  }
  return <Voting votedUsers={votedUsers} room={room} user={user}/>
}

export const VoteScreen = ({ user }: {user: User}) => {
  const [searchParams] = useSearchParams()
  const roomId = searchParams.get('id')
  const roomSizeString = searchParams.get('size')

  const invalidRoomSizeString = roomSizeString == null || !Number.isInteger(parseFloat(roomSizeString)) || parseInt(roomSizeString) <= 0
  if (roomId == null || invalidRoomSizeString) {
    return (
      <h1>
        URLが不正です。有効なroomIdとroomSizeを指定してください。
      </h1>
    )
  }
  const room = { id: roomId, size: parseInt(roomSizeString) }

  return (
    <AlertProvider>
      <SignOutButton />
      <h1 style={{ justifyContent: 'center', display: 'flex', fontWeight: 'bold', padding: '0.5rem' }}>投票所（定員: {roomSizeString}名）</h1>
      <CustomAlert />
      <VoteRouter room={room} user={user}/>
      <Link to="/create-new-room" style={{ fontSize: '1rem', padding: '1rem' }}>新しい投票所を作成する</Link>
    </AlertProvider>
  )
}

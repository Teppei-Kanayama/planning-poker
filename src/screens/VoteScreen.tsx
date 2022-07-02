import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { subscribeCollection } from '../data/firebase'
import { LoadingScreen } from './LoadingScreen'
import { Room, User } from '../types'
import { Closed } from './vote/Closed'
import { Voting } from './vote/Voting'
import { CustomAlert } from '../components/Alert'
import { AlertProvider } from '../hooks/alert'
import { NavigationBar } from '../components/NavigationBar'

const VoteRouter = ({ room, user }: {room: Room, user: User}) => {
  const [votedUsers, setVotedUsers] = useState<User[]>([])
  const voteCount = votedUsers.length

  useEffect(
    () => {
      const unsubscribe = subscribeCollection(
        (querySnapshot) => {
          const votedUsersArray: User[] = []
          querySnapshot.forEach(
            (doc) => {
              const data = doc.data()
              if (data.roomId === room.id) {
                votedUsersArray.push({ id: data.userId, iconUrl: data.userIconUrl, name: data.userName })
              }
            }
          )
          setVotedUsers(votedUsersArray)
        }
      )
      return () => { unsubscribe() }
    }
    , [])

  if (voteCount == null) {
    return <LoadingScreen />
  }
  if (voteCount >= room.size) {
    return <Closed room={room} user={user} />
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
      <NavigationBar />
      <h1 style={{ display: 'flex', justifyContent: 'center', fontWeight: 'bold', padding: '0.5rem' }}>投票所（定員: {roomSizeString}名）</h1>
      <CustomAlert />
      <VoteRouter room={room} user={user}/>
      <Link to="/create-new-room" style={{ fontSize: '1rem', padding: '1rem' }}>新しい投票所を作成する</Link>
    </AlertProvider>
  )
}

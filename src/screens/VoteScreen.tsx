import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { subscribeCollection } from '../data/firebase'
import { LoadingScreen } from './LoadingScreen'
import { Room, User } from '../types'
import { Closed } from './VoteScreen/Closed'
import { Voting } from './VoteScreen/Voting'
import { CustomAlert } from './VoteScreen/components/Alert'
import { AlertProvider } from '../hooks/alert'
import { NavigationBar } from './components/NavigationBar'
import { Button } from 'react-bootstrap'

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

  useEffect(
    () => {
      if (room.activateBot) {
        console.log('botが有効です')
      }
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
  const activateBot = searchParams.get('b') === 'true'

  const invalidRoomSizeString = roomSizeString == null || !Number.isInteger(parseFloat(roomSizeString)) || parseInt(roomSizeString) <= 0
  if (roomId == null || invalidRoomSizeString) {
    return (
      <>
        <NavigationBar isSignedIn={true} />
        <p style={{ margin: '2rem' }}> URLが不正です。再度URLを入力するか、投票所を新規作成してください。</p>
        <div style={{ display: 'flex' }}>
          <Button
            href={'/create-new-room'}
            style={{ display: 'flex', justifyContent: 'center', padding: '0.5rem', marginLeft: '3rem' }}
          >
            投票所を新規作成する
          </Button>
        </div>
      </>
    )
  }
  const room = { id: roomId, size: parseInt(roomSizeString), activateBot: activateBot }

  return (
    <AlertProvider>
      <NavigationBar isSignedIn={true} />
      <h1 style={{ display: 'flex', justifyContent: 'center', fontWeight: 'bold', margin: '2rem' }}>投票所（定員: {roomSizeString}名）</h1>
      <CustomAlert />
      <VoteRouter room={room} user={user}/>
      <Link to="/create-new-room" style={{ fontSize: '1rem', padding: '1rem' }}>新しい投票所を作成する</Link>
    </AlertProvider>
  )
}

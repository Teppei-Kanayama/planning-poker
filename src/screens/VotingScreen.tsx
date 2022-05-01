/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { MdHowToVote, MdCoffee, MdAccountCircle } from 'react-icons/md'
import ReactTooltip from 'react-tooltip'

import { addVote, deleteAllVotes, subscribeCollection } from '../data/firebase'
import { FibonacciCards, VoteCards } from '../components/Cards'
import { ResetButton, SignOutButton, VoteButton } from '../components/Button'
import { useAllPoints, useMyPoint } from '../hooks/points'
import { Message } from '../components/Message'
import { LoadingScreen } from './LoadingScreen'
import { Room, User } from '../types'

type CommonProps = {
  room: Room,
  user: User,
}

const VotedUserIcons = ({ votedUserIconUrls, roomSize }: {votedUserIconUrls: string[], roomSize: number}) => {
  return (
    <div style={{ display: 'flex', marginLeft: '1rem', fontSize: '1.5em' }}>
      投票済みユーザー：
    {
       votedUserIconUrls.length > 0
         ? (
             votedUserIconUrls.map((url) => {
               const style = { height: '2rem', margin: '0.2rem' }
               if (url === '') {
                 return <MdAccountCircle key={url} style={style}/>
               }
               return (
                 <>
                  <img key={url} src={url} style={style} data-tip="hello world"/>
                  <ReactTooltip />
                 </>
               )
             })
           )
         : <>0人</>
    }
     / {roomSize}人
    </div>
  )
}

const Voting = (props: CommonProps & {votedUserIconUrls: string[]}) => {
  const { room, user, votedUserIconUrls } = props

  const [temporaryPoint, setTemporaryPoint] = useState<number>()

  const handleClickVoteCard = (p: number) => {
    setTemporaryPoint(p)
  }

  const handleClickVoteButton = async () => {
    if (temporaryPoint != null) {
      await addVote(room.id, user.id, user.iconUrl, temporaryPoint)
    }
  }

  const message = temporaryPoint == null ? '投票してください' : `投票してください（現在の選択：${temporaryPoint}）`

  return (
    <>
      <Message PrefixIconComponent={MdHowToVote} message={message}/>
      <VotedUserIcons votedUserIconUrls={votedUserIconUrls} roomSize={room.size}/>
      <FibonacciCards onClick={handleClickVoteCard} showWallaby={true}/>
      <VoteButton onClick={handleClickVoteButton} disabled={temporaryPoint == null}/>
    </>
  )
}

const Voted = (props: CommonProps & {votedUserIconUrls: string[]}) => {
  const { room, user, votedUserIconUrls } = props
  const [myPoint] = useMyPoint(room.id, user.id)

  return (
  <>
    <Message PrefixIconComponent={MdCoffee} message={'他の人が投票を終えるまでお待ちください'}/>
    <VotedUserIcons votedUserIconUrls={votedUserIconUrls} roomSize={room.size}/>
    <FibonacciCards disabled myPoint={myPoint} showWallaby={true}/>
    <VoteButton disabled />
  </>)
}

const Closed = (props: CommonProps) => {
  const { room, user } = props
  const [myPoint] = useMyPoint(room.id, user.id)
  const [points] = useAllPoints(room.id)

  const onClickResetAllVotes = async () => {
    await deleteAllVotes(room.id)
  }

  const getMessage = () => {
    if (points.length === 0) {
      return ''
    }
    const maxPoint = Math.max(...points)
    const minPoint = Math.min(...points)
    if (maxPoint === minPoint) {
      return '【投票結果】 全員一致 🎉'
    }
    return `【投票結果】 まずは${minPoint}ポイントに投票した人に話を聞いてみましょう！`
  }

  // TODO: 各投票とアイコンを並べて表示する
  return (
    <>
      <FibonacciCards disabled myPoint={myPoint} showWallaby={true}/>
      <VoteButton disabled />
      <p style={{ fontSize: '1.5em', marginLeft: '1rem' }}>
        {getMessage()}
      </p>
      <VoteCards points={points} disabled/>
      <ResetButton onClick={onClickResetAllVotes} />
    </>
  )
}

const VotingRouter = ({ room, user }: {room: Room, user: User}) => {
  const [votedUserIconUrls, setVotedUserIconUrls] = useState<string[]>([])
  const [myVoteCount, setMyVoteCount] = useState<number>()
  const commonProps = { room, user }
  const voteCount = votedUserIconUrls.length

  useEffect(
    () => {
      const unsubscribe = subscribeCollection(
        (querySnapshot) => {
          let myCount = 0
          const votedUrls: string[] = []
          querySnapshot.forEach(
            (doc) => {
              const data = doc.data()
              if (data.roomId === room.id) {
                votedUrls.push(data.userIconUrl)
                if (data.userId === user.id) {
                  myCount += 1
                }
              }
            }
          )
          setVotedUserIconUrls(votedUrls)
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
    return <Closed {...commonProps}/>
  }
  if (myVoteCount >= 1) {
    return <Voted votedUserIconUrls={votedUserIconUrls} {...commonProps}/>
  }
  return <Voting votedUserIconUrls={votedUserIconUrls} {...commonProps}/>
}

export const VotingScreen = ({ user }: {user: User}) => {
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
    <>
      <SignOutButton />
      <h1 style={{ justifyContent: 'center', display: 'flex', fontWeight: 'bold', padding: '0.5rem' }}>投票所（定員: {roomSizeString}名）</h1>
      <VotingRouter room={room} user={user}/>
      <Link to="/create-new-room" style={{ fontSize: '1rem', padding: '1rem' }}>新しい投票所を作成する</Link>
    </>
  )
}

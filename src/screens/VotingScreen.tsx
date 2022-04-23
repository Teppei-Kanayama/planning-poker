/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { MdHowToVote, MdCoffee } from 'react-icons/md'

import { addVote, deleteAllVotes, subscribeCollection } from '../data/firebase'
import { FibonacciCards, VoteCards } from '../components/Cards'
import { ResetButton, SignOutButton, VoteButton } from '../components/Button'
import { useAllPoints, useMyPoint } from '../hooks/points'
import { Message } from '../components/Message'
import { LoadingScreen } from './LoadingScreen'

type CommonProps = {
  roomId: string,
  roomSize: number,
  userId: string,
  userIconUrl: string | undefined,
}

const Voting = (props: CommonProps & {voteCount: number}) => {
  const { roomId, roomSize, userId, userIconUrl, voteCount } = props

  const [temporaryPoint, setTemporaryPoint] = useState<number>()

  const handleClickVoteCard = (p: number) => {
    setTemporaryPoint(p)
  }

  const handleClickVoteButton = async () => {
    if (temporaryPoint != null) {
      await addVote(roomId, userId, userIconUrl, temporaryPoint)
    }
  }

  const message = temporaryPoint == null ? '投票してください' : `投票してください（現在の選択：${temporaryPoint}）`

  return (
    <>
      <Message PrefixIconComponent={MdHowToVote} message={message}/>
      <Message PrefixIconComponent={MdHowToVote} message={`${voteCount}人/${roomSize}人 投票済み`}/>
      <FibonacciCards onClick={handleClickVoteCard} showWallaby={true}/>
      <VoteButton onClick={handleClickVoteButton} disabled={temporaryPoint == null}/>
    </>
  )
}

const Voted = (props: CommonProps & {voteCount: number}) => {
  const { roomSize, voteCount, roomId, userId } = props
  const [myPoint] = useMyPoint(roomId, userId)

  // TODO: 削除機能をつける
  return (
  <>
    <Message PrefixIconComponent={MdCoffee} message={'他の人が投票を終えるまでお待ちください'}/>
    <Message PrefixIconComponent={MdCoffee} message={`${voteCount}人/${roomSize}人 投票済み`}/>
    <FibonacciCards disabled myPoint={myPoint} showWallaby={true}/>
    <VoteButton disabled />
  </>)
}

const Closed = (props: CommonProps) => {
  const { roomId, userId } = props
  const [myPoint] = useMyPoint(roomId, userId)
  const [points] = useAllPoints(roomId)

  const onClickResetAllVotes = async () => {
    await deleteAllVotes(roomId)
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

  // user名またはアイコンを表示する
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

const VotingRouter = ({ roomId, roomSize, userId, userIconUrl }: {roomId: string, roomSize: number, userId: string, userIconUrl: string | undefined}) => {
  const [voteCount, setVoteCount] = useState<number>()
  const [myVoteCount, setMyVoteCount] = useState<number>()
  const commonProps = { roomId, roomSize, userId, userIconUrl }

  useEffect(
    () => {
      const unsubscribe = subscribeCollection(
        (querySnapshot) => {
          let count = 0
          let myCount = 0
          querySnapshot.forEach(
            (doc) => {
              const data = doc.data()
              if (data.roomId === roomId) {
                count += 1
                if (data.userId === userId) {
                  myCount += 1
                }
              }
            }
          )
          setVoteCount(count)
          setMyVoteCount(myCount)
        }
      )
      return () => { unsubscribe() }
    }
    , [])

  if (voteCount == null || myVoteCount == null) {
    return <LoadingScreen />
  }
  if (voteCount >= roomSize) {
    return <Closed {...commonProps}/>
  }
  if (myVoteCount >= 1) {
    return <Voted voteCount={voteCount} {...commonProps}/>
  }
  return <Voting voteCount={voteCount} {...commonProps}/>
}

export const VotingScreen = ({ userId, userIconUrl }: {userId: string, userIconUrl: string | undefined}) => {
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

  return (
    <>
      <SignOutButton />
      <h1 style={{ justifyContent: 'center', display: 'flex', fontWeight: 'bold', padding: '0.5rem' }}>投票所（定員: {roomSizeString}名）</h1>
      <img src={userIconUrl} />
      <VotingRouter roomId={roomId} roomSize={parseInt(roomSizeString)} userId={userId} userIconUrl={userIconUrl}/>
      <Link to="/create-new-room" style={{ fontSize: '1rem', padding: '1rem' }}>新しい投票所を作成する</Link>
    </>
  )
}

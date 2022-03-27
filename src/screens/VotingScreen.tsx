/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MdHowToVote, MdCoffee } from 'react-icons/md'
// import { DocumentData, QuerySnapshot } from 'firebase/firestore'

import { addVote, deleteAllVotes, fetchAllPoints, subscribeCollection } from '../data/firebase'
import { FibonacciCards, VoteCards } from '../components/Cards'
import { ResetButton, VoteButton } from '../components/Button'
import { useMyPoint } from '../hooks/points'
import { Message } from '../components/Message'

type CommonProps = {
  roomId: string,
  roomSize: number,
  userId: string
}

const Voting = (props: CommonProps) => {
  const { roomId, userId } = props

  const [temporaryPoint, setTemporaryPoint] = useState<number>()

  const handleClickVoteCard = (p: number) => {
    setTemporaryPoint(p)
  }

  const handleClickVoteButton = async () => {
    if (temporaryPoint != null) {
      await addVote(roomId, userId, temporaryPoint)
    }
  }

  return (
    <>
      <Message PrefixIconComponent={MdHowToVote} message='投票してください'/>
      <FibonacciCards onClick={handleClickVoteCard} />
      <VoteButton onClick={handleClickVoteButton} disabled={temporaryPoint == null}/>
    </>
  )
}

const Voted = (props: CommonProps & {voteCount: number}) => {
  const { roomSize, voteCount, roomId, userId } = props
  const [myPoint] = useMyPoint(roomId, userId)

  return (
  <>
    <Message PrefixIconComponent={MdCoffee} message={`他の人が投票を終えるまでお待ちください（${voteCount}人/${roomSize}人 投票済み）`}/>
    <FibonacciCards disabled myPoint={myPoint}/>
    <VoteButton disabled />
  </>)
}

const Closed = (props: CommonProps) => {
  const { roomId, userId } = props
  const [myPoint] = useMyPoint(roomId, userId)

  // TODO: ここをcustom hookに置き換える
  const [points, setPoints] = useState<number[]>([])

  useEffect(() => {
    const setAllPoints = async () => {
      const allPoints = await fetchAllPoints(roomId)
      setPoints(allPoints)
    }
    setAllPoints()
  }, [])

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

  return (
    <>
      <FibonacciCards disabled myPoint={myPoint}/>
      <VoteButton disabled/>
      <p style={{ fontSize: '1.5em', marginLeft: '1rem' }}>
        {getMessage()}
      </p>
      <VoteCards points={points} disabled/>
      <ResetButton onClick={onClickResetAllVotes} />
    </>
  )
}

const VotingRouter = ({ roomId, roomSize, userId }: {roomId: string, roomSize: number, userId: string}) => {
  const [voteCount, setVoteCount] = useState(0)
  const [myVoteCount, setMyVoteCount] = useState(0)
  const commonProps = {
    roomId: roomId,
    roomSize: roomSize,
    userId: userId
  }

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

  if (voteCount >= roomSize) {
    return <Closed {...commonProps}/>
  }
  if (myVoteCount >= 1) {
    return <Voted voteCount={voteCount} {...commonProps}/>
  }
  return <Voting {...commonProps}/>
}

export const VotingScreen = ({ userId }: {userId: string}) => {
  const [searchParams] = useSearchParams()
  const roomId = searchParams.get('id')
  const roomSizeString = searchParams.get('size')

  if (roomId == null || roomSizeString == null || isNaN(parseInt(roomSizeString))) {
    return (
      <h1>
        URLが不正です。有効なroomIdとroomSizeを指定してください。
      </h1>
    )
  }

  return (
    <>
      <h1 style={{ justifyContent: 'center', display: 'flex', fontWeight: 'bold', padding: '0.5rem' }}>投票所（定員: {roomSizeString}名）</h1>
      <VotingRouter roomId={roomId} roomSize={parseInt(roomSizeString)} userId={userId}/>
    </>
  )
}

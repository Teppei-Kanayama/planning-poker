/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MdHowToVote, MdCoffee } from 'react-icons/md'
import { DocumentData, QuerySnapshot } from 'firebase/firestore'

import { addVote, deleteAllVotes, fetchAllPoints, subscribeCollection } from '../data/firebase'
import { FibonacciCards, VoteCards } from '../components/Cards'
import { ResetButton, VoteButton } from '../components/Button'
import { useMyPoint } from '../hooks/points'

const Voting = ({ onClickVoteButton }
  : {onClickVoteButton: (p: number | undefined) => Promise<void>}) => {
  const [temporaryPoint, setTemporaryPoint] = useState<number>()

  const onClickVoteCard = (p: number) => {
    setTemporaryPoint(p)
  }

  return (
    <>
      {/* TODO: メッセージ部分をコンポーネントして切り出す */}
      <p style={{ fontSize: '1.5em', marginLeft: '1rem' }}>
        <MdHowToVote /> 投票してください
      </p>
      <FibonacciCards onClick={onClickVoteCard} />
      <VoteButton onClick={() => { onClickVoteButton(temporaryPoint) }} disabled={temporaryPoint == null}/>
    </>
  )
}

const Voted = ({ roomSize, voteCount, roomId, userId }: {roomSize: number, voteCount: number, roomId: string, userId: string}) => {
  const [myPoint] = useMyPoint(roomId, userId)

  return (
  <>
    <p style={{ fontSize: '1.5em', marginLeft: '1rem' }}>
        <MdCoffee /> 他の人が投票を終えるまでお待ちください（{voteCount}人/{roomSize}人 投票済み）
    </p>
    <FibonacciCards disabled myPoint={myPoint}/>
    <VoteButton disabled />
  </>)
}

const Closed = ({ roomId, userId }: {roomId: string, userId: string}) => {
  const [myPoint] = useMyPoint(roomId, userId)
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

  const maxPoint = Math.max(...points)
  const minPoint = Math.min(...points)
  // TODO:ここの挙動が怪しい
  const message = maxPoint === minPoint ? '全員一致 🎉' : `まずは${minPoint}ポイントに投票した人に話を聞いてみましょう！`

  return (
    <>
      <FibonacciCards disabled myPoint={myPoint}/>
      <VoteButton disabled/>
      <p style={{ fontSize: '1.5em', marginLeft: '1rem' }}>
        【投票結果】 {message}
      </p>
      <VoteCards points={points} disabled/>
      <ResetButton onClick={onClickResetAllVotes} />
    </>
  )
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

  const roomSize = parseInt(roomSizeString)

  // TODO: ここから別コンポーネントにしたい

  const [voteCount, setVoteCount] = useState(0)
  const [myVoteCount, setMyVoteCount] = useState(0)

  const handleClickVoteButton = async (point: number | undefined) => {
    if (point != null) {
      await addVote(roomId, userId, point)
    }
  }

  const handleUpdateCollection = (querySnapshot: QuerySnapshot<DocumentData>) => {
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

  useEffect(
    () => {
      const unsub = subscribeCollection(handleUpdateCollection)
      return () => { unsub() }
    }
    , [])

  const getStatus = () => {
    if (voteCount >= roomSize) {
      return 'closed'
    }
    if (myVoteCount >= 1) {
      return 'voted'
    }
    return 'voting'
  }
  const status = getStatus()

  return (
    <>
      <h1 style={{ justifyContent: 'center', display: 'flex', fontWeight: 'bold', padding: '0.5rem' }}>投票所（定員: {roomSize}名）</h1>
      {
        status === 'voting' && (
          <Voting onClickVoteButton={handleClickVoteButton}/>
        )
      }
      {
        status === 'voted' && (
          <Voted roomSize={roomSize} voteCount={voteCount} roomId={roomId} userId={userId}/>
        )
      }
      {
        status === 'closed' && (
          <Closed roomId={roomId} userId={userId}/>
        )
      }
    </>
  )
}

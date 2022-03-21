/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { addVote, countVotes, deleteAllVotes, fetchAllPoints, findVote } from '../data/firebase'
import { FibonacciCards, VoteCards } from '../components/Cards'
import { getUserId } from '../data/localStorage'
import { ResetButton, VoteButton } from '../components/Button'

type Status = 'voting' | 'voted' | 'closed'

// 自分が投票したポイントを管理するカスタムフック
const useMyPoint = (roomId: string, userId: string) => {
  const [myPoint, setMyPoint] = useState<number>()

  useEffect(() => {
    const setExistingPoint = async () => {
      const vote = await findVote(roomId, userId)
      if (vote != null) {
        setMyPoint(vote.point)
      }
    }
    setExistingPoint()
  }, [])

  return [myPoint, setMyPoint] as const
}

const Voting = ({ onClickVoteButton }
  : {onClickVoteButton: (p: number | undefined) => Promise<void>}) => {
  const [temporaryPoint, setTemporaryPoint] = useState<number>()

  const onClickVoteCard = (p: number) => {
    setTemporaryPoint(p)
  }

  return (
    <>
      <p>
        { `投票してください（現在選択中のpointは${temporaryPoint}です）` }
      </p>
      <FibonacciCards onClick={onClickVoteCard} />
      <br />
      <VoteButton onClick={() => { onClickVoteButton(temporaryPoint) }} disabled={temporaryPoint == null}/>
      <br />
      <ResetButton disabled/>
    </>
  )
}

const Voted = ({ roomSize, myPoint, nVotes }: {roomSize: number, myPoint: number | undefined, nVotes: number}) => {
  return (
  <>
    <p>
    { `他の人が投票を終えるまでお待ちください（${nVotes}/${roomSize}名投票済み）` }
    </p>
    <p>
    { `私の投票は${myPoint}ポイントです` }
    </p>
    <FibonacciCards disabled />
    <br />
    <VoteButton disabled />
    <br />
    <ResetButton disabled/>
  </>)
}

const Closed = ({ roomId, myPoint }: {roomId: string, myPoint: number | undefined}) => {
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

  return (
    <>
      <p>
        { `私の投票は${myPoint}ポイントです` }
      </p>
      <FibonacciCards disabled/>
      <br />
      <VoteButton disabled/>
      <br />
      <VoteCards points={points} disabled/>
      <br />
      <ResetButton onClick={onClickResetAllVotes} />
    </>
  )
}

export const VotingScreen = () => {
  const [status, setStatus] = useState<Status>('voting')
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
  const userId = getUserId()

  const [myPoint, setMyPoint] = useMyPoint(roomId, userId)
  const [nVotes, setNVotes] = useState(0)

  const handleClickVoteButton = async (point: number | undefined) => {
    if (point != null) {
      await addVote(roomId, userId, point)
      setMyPoint(point)
      setStatus('voted')
    }
  }

  const updateStatus = async () => {
    const _nVotes = await countVotes(roomId)
    setNVotes(_nVotes)
    if (_nVotes >= roomSize) {
      setStatus('closed')
    } else if (_nVotes === 0) {
      setStatus('voting')
    } else if (myPoint != null) {
      setStatus('voted')
    }
  }

  useEffect(
    () => {
      const nIntervId = setInterval(updateStatus, 3000)
      return () => { clearInterval(nIntervId) }
    }
  )

  if (status === 'voting') {
    return <Voting onClickVoteButton={handleClickVoteButton}/>
  }

  if (status === 'voted') {
    return <Voted roomSize={roomSize} myPoint={myPoint} nVotes={nVotes}/>
  }

  return <Closed roomId={roomId} myPoint={myPoint}/>
}

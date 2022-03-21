/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { addVote, countVotes, deleteAllVotes, fetchAllPoints, findVote } from '../data/firebase'
import { FibonacciCards, VoteCards } from '../components/Cards'
import { getUserId } from '../data/localStorage'
import { ResetButton, VoteButton } from '../components/Button'

type Status = 'voting' | 'voted' | 'closed'

const Voting = ({ roomId, userId }: {roomId: string, userId: string}) => {
  const [point, setPoint] = useState<number>()

  useEffect(() => {
    const setExistingPoint = async () => {
      const vote = await findVote(roomId, userId)
      if (vote != null) {
        setPoint(vote.point)
      }
    }
    setExistingPoint()
  }, [])

  const onClickVoteButton = async () => {
    if (point != null) {
      await addVote(roomId, userId, point)
    }
  }

  const onClickVoteCard = (p: number) => {
    setPoint(p)
  }

  return (
    <>
      <h1>
        { `pointは${point}です` }
      </h1>
      <FibonacciCards onClick={onClickVoteCard} />
      <br />
      <VoteButton onClick={onClickVoteButton} disabled={point == null}/>
      <br />
      <ResetButton disabled/>
    </>
  )
}

const Voted = () => {
  return <></>
}

const Closed = ({ roomId }: {roomId: string}) => {
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
        URLが不正です。roomIdとroomSizeを指定してください。
      </h1>
    )
  }

  const userId = getUserId()

  const judgeIsActive = async () => {
    const nVotes = await countVotes(roomId)
    if (nVotes >= parseInt(roomSizeString)) {
      setStatus('closed')
    } else if (nVotes === 0) {
      setStatus('voting')
    }
  }

  useEffect(
    () => {
      const nIntervId = setInterval(judgeIsActive, 3000)
      return () => { clearInterval(nIntervId) }
    }
  )

  if (status === 'voting') {
    return <Voting roomId={roomId} userId={userId} />
  }

  if (status === 'voted') {
    return <Voted />
  }

  return <Closed roomId={roomId} />
}

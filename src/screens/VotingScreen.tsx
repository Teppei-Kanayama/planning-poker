/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { addVote, countVotes, deleteAllVotes, fetchAllPoints, findVote } from '../data/firebase'
import { FibonacciCards, VoteCards } from '../components/Cards'
import { getUserId } from '../data/localStorage'
import { ResetButton, VoteButton } from '../components/Button'

type Status = 'voting' | 'voted' | 'closed'

const useHasVoted = (roomId: string, userId: string) => {
  const [hasVoted, setHasVoted] = useState<boolean>(false)

  useEffect(() => {
    const setExistingPoint = async () => {
      const vote = await findVote(roomId, userId)
      if (vote != null) {
        setHasVoted(true)
      }
    }
    setExistingPoint()
  }, [])

  return hasVoted
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

const Voted = () => {
  return <p>他の人が投票を終えるまでお待ちください（n/n名投票済み）</p>
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

  const hasVoted = useHasVoted(roomId, userId)

  const handleClickVoteButton = async (point: number | undefined) => {
    if (point != null) {
      await addVote(roomId, userId, point)
      setStatus('voted')
    }
  }

  const judgeIsActive = async () => {
    const nVotes = await countVotes(roomId)
    if (nVotes >= parseInt(roomSizeString)) {
      setStatus('closed')
    } else if (nVotes === 0) {
      setStatus('voting')
    } else if (hasVoted) {
      setStatus('voted')
    }
  }

  useEffect(
    () => {
      const nIntervId = setInterval(judgeIsActive, 3000)
      return () => { clearInterval(nIntervId) }
    }
  )

  if (status === 'voting') {
    return <Voting onClickVoteButton={handleClickVoteButton}/>
  }

  if (status === 'voted') {
    return <Voted />
  }

  return <Closed roomId={roomId} />
}

/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { addVote, countVotes, deleteAllVotes, fetchAllPoints, findVote } from '../firebase/firebase'
import { v4 as uuidv4 } from 'uuid'

const fibonacci = [0, 1, 2, 3, 5, 8, 13, 21]

const getUserId = () => {
  let userId: string
  const storedUserId = localStorage.getItem('userId')
  if (storedUserId == null) {
    userId = uuidv4()
    localStorage.setItem('userId', userId)
  } else {
    userId = storedUserId
  }
  return userId
}

const VoteCard = ({ point, onClick }: {point: number, onClick: (p: number) => void}) => {
  return (
    <button onClick={() => { onClick(point) }}>{point}</button>
  )
}

const VoteCards = ({ points, onClick }: {points: number[], onClick: (p: number) => void}) => {
  return (
    <>
    {points.map((i) => {
      return (
      <VoteCard
        key={i}
        point={i}
        onClick={onClick}
      />
      )
    })}
  </>
  )
}

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
        { `あなたのuserIdは${userId}、roomIdは${roomId}、pointは${point}です` }
      </h1>
      <VoteCards points={fibonacci} onClick={onClickVoteCard} />
      <br />
      <button onClick={onClickVoteButton} disabled={point == null}>
          投票
      </button>
    </>
  )
}

const Voted = ({ roomId }: {roomId: string}) => {
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
      <VoteCards points={fibonacci} onClick={() => {}} />
      <br />
      <button onClick={() => {}} disabled={true}>
          投票
      </button>
      <br />
      <VoteCards points={points} onClick={() => {}} />
      <br />
      <button onClick={onClickResetAllVotes}>
          全員の投票をリセット
      </button>
    </>
  )
}

export const VotingScreen = () => {
  const [isActive, setIsActive] = useState(true)
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

  useEffect(() => {
    const judgeIsActive = async () => {
      const nVotes = await countVotes(roomId)
      if (nVotes >= parseInt(roomSizeString)) {
        setIsActive(false)
      } else if (nVotes === 0) {
        setIsActive(true)
      }
    }
    judgeIsActive()
  })

  return (
    isActive
      ? <Voting roomId={roomId} userId={userId} />
      : <Voted roomId={roomId} />
  )
}

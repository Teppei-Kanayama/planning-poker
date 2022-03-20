/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { addVote, countVotes, deleteAllVotes, findVote } from '../firebase/firebase'
import { v4 as uuidv4 } from 'uuid'

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

const fibonacci = [0, 1, 2, 3, 5, 8, 13, 21]

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

  const onClickResetAllVotes = async () => {
    await deleteAllVotes(roomId)
  }

  const onClickVote = async () => {
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
      {
        fibonacci.map((i) => {
          return (
            <VoteCard
              key={i}
              point={i}
              onClick={onClickVoteCard}
            />
          )
        })
      }
      <br />
      <button onClick={onClickVote} disabled={point == null}>
          投票
      </button>
      <button onClick={onClickResetAllVotes}>
          全員の投票をリセット
      </button>
    </>
  )
}

export const VotingScreen = () => {
  // const [isActive, setIsActive] = useState(true)
  const [searchParams] = useSearchParams()
  const roomId = searchParams.get('id')
  const roomSize = searchParams.get('size')

  if (roomId == null || roomSize == null) {
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
      console.log(nVotes)
    }
    judgeIsActive()
  })

  return <Voting roomId={roomId} userId={userId} />
}

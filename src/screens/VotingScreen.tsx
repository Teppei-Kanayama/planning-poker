/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MdHowToVote, MdCoffee } from 'react-icons/md'

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
      {/* TODO: メッセージ部分をコンポーネントして切り出す */}
      <p style={{ fontSize: '1.5em', marginLeft: '1rem' }}>
        <MdHowToVote /> 投票してください
      </p>
      <FibonacciCards onClick={onClickVoteCard} />
      <VoteButton onClick={() => { onClickVoteButton(temporaryPoint) }} disabled={temporaryPoint == null}/>
    </>
  )
}

const Voted = ({ roomSize, myPoint, nVotes }: {roomSize: number, myPoint: number | undefined, nVotes: number}) => {
  return (
  <>
    <p style={{ fontSize: '1.5em', marginLeft: '1rem' }}>
        <MdCoffee /> 他の人が投票を終えるまでお待ちください（{nVotes}人/{roomSize}人 投票済み）
    </p>
    <FibonacciCards disabled myPoint={myPoint}/>
    <VoteButton disabled />
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

  // TODO: 投票ボタンを押した直後、即座にnVotesに1を加えると良さそう
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
          <Voted roomSize={roomSize} myPoint={myPoint} nVotes={nVotes}/>
        )
      }
      {
        status === 'closed' && (
          <Closed roomId={roomId} myPoint={myPoint}/>
        )
      }
    </>
  )
}

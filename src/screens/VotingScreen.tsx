/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { MdHowToVote, MdCoffee, MdAccountCircle } from 'react-icons/md'

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

const VotedUserIcons = ({ votedUserIconUrls, roomSize }: {votedUserIconUrls: string[], roomSize: number}) => {
  // TODO: urlがなかった場合
  // TODO: まだだれも投票していなかった場合
  return (
    <div style={{ display: 'flex', marginLeft: '1rem', fontSize: '1.5em' }}>
      投票済みユーザー：
    {
      votedUserIconUrls.map((url) => {
        const style = { height: '2rem', margin: '0.2rem' }
        if (url === '') {
          return <MdAccountCircle style={style}/>
        }
        return (<img key={url} src={url} style={style}/>)
      })
    }
     / {roomSize}人
    </div>
  )
}

const Voting = (props: CommonProps & {votedUserIconUrls: string[]}) => {
  const { roomId, roomSize, userId, userIconUrl, votedUserIconUrls } = props

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
      <VotedUserIcons votedUserIconUrls={votedUserIconUrls} roomSize={roomSize}/>
      <FibonacciCards onClick={handleClickVoteCard} showWallaby={true}/>
      <VoteButton onClick={handleClickVoteButton} disabled={temporaryPoint == null}/>
    </>
  )
}

const Voted = (props: CommonProps & {votedUserIconUrls: string[]}) => {
  const { roomSize, roomId, userId, votedUserIconUrls } = props
  const [myPoint] = useMyPoint(roomId, userId)

  return (
  <>
    <Message PrefixIconComponent={MdCoffee} message={'他の人が投票を終えるまでお待ちください'}/>
    <VotedUserIcons votedUserIconUrls={votedUserIconUrls} roomSize={roomSize}/>
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

const VotingRouter = ({ roomId, roomSize, userId, userIconUrl }: {roomId: string, roomSize: number, userId: string, userIconUrl: string | undefined}) => {
  const [votedUserIconUrls, setVotedUserIconUrls] = useState<string[]>([])
  const [myVoteCount, setMyVoteCount] = useState<number>()
  const commonProps = { roomId, roomSize, userId, userIconUrl }
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
              if (data.roomId === roomId) {
                votedUrls.push(data.userIconUrl)
                if (data.userId === userId) {
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
  if (voteCount >= roomSize) {
    return <Closed {...commonProps}/>
  }
  if (myVoteCount >= 1) {
    return <Voted votedUserIconUrls={votedUserIconUrls} {...commonProps}/>
  }
  return <Voting votedUserIconUrls={votedUserIconUrls} {...commonProps}/>
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
      <VotingRouter roomId={roomId} roomSize={parseInt(roomSizeString)} userId={userId} userIconUrl={userIconUrl}/>
      <Link to="/create-new-room" style={{ fontSize: '1rem', padding: '1rem' }}>新しい投票所を作成する</Link>
    </>
  )
}

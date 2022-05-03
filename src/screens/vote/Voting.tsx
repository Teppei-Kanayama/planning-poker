/* eslint-disable no-use-before-define */
import React, { useState } from 'react'
import { MdHowToVote } from 'react-icons/md'

import { addVote } from '../../data/firebase'
import { FibonacciCards } from '../../components/Cards'
import { VoteButton } from '../../components/Button'
import { Message } from '../../components/Message'
import { Room, User } from '../../types'
import { VotedUserIcons } from '../../components/VotedUserIcons'
import { useAlertContext } from '../../hooks/alert'

export const Voting = ({ room, user, votedUsers }: {room: Room, user: User, votedUsers: User[]}) => {
  const [temporaryPoint, setTemporaryPoint] = useState<number>()
  const { setAlertType } = useAlertContext()

  const handleClickVoteCard = (p: number) => {
    setTemporaryPoint(p)
  }

  const handleClickVoteButton = async () => {
    const handleError = () => {
      setAlertType('OtherErrors')
    }

    if (temporaryPoint != null) {
      await addVote(room.id, user, temporaryPoint, handleError)
    }
  }

  const message = temporaryPoint == null ? '投票してください' : `投票してください（現在の選択：${temporaryPoint}）`

  return (
    <>
      <Message PrefixIconComponent={MdHowToVote} message={message}/>
      <VotedUserIcons votedUsers={votedUsers} roomSize={room.size}/>
      <FibonacciCards onClick={handleClickVoteCard} showWallaby={true}/>
      <VoteButton onClick={handleClickVoteButton} disabled={temporaryPoint == null}/>
    </>
  )
}

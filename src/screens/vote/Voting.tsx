/* eslint-disable no-use-before-define */
import React, { useContext, useState } from 'react'
import { MdHowToVote } from 'react-icons/md'

import { addVote } from '../../data/firebase'
import { FibonacciCards } from '../../components/Cards'
import { VoteButton } from '../../components/Button'
import { Message } from '../../components/Message'
import { Room, User } from '../../types'
import { VotedUserIcons } from '../../components/VotedUserIcons'
import { AlertContext } from '../VoteScreen'

export const Voting = ({ room, user, votedUsers }: {room: Room, user: User, votedUsers: User[]}) => {
  const [temporaryPoint, setTemporaryPoint] = useState<number>()
  const { setMessage, setIsOpen } = useContext(AlertContext)

  const handleClickVoteCard = (p: number) => {
    setTemporaryPoint(p)
    setMessage('あいうえお')
    setIsOpen(true)
  }

  const handleClickVoteButton = async () => {
    if (temporaryPoint != null) {
      await addVote(room.id, user, temporaryPoint)
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

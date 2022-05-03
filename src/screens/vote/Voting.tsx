import React from 'react'
import { MdHowToVote } from 'react-icons/md'

import { addVote } from '../../data/firebase'
import { FibonacciCards } from '../../components/Cards'
import { Message } from '../../components/Message'
import { Room, User } from '../../types'
import { VotedUserIcons } from '../../components/VotedUserIcons'
import { useAlertContext } from '../../hooks/alert'
import { useMyPoint } from '../../hooks/votes'
import { ResetButton } from '../../components/Button'

export const Voting = ({ room, user, votedUsers }: {room: Room, user: User, votedUsers: User[]}) => {
  const [myPoint] = useMyPoint(room.id, user.id)
  const { setAlert, resetAlert } = useAlertContext()

  const handleClickVoteCard = async (p: number) => {
    await addVote(room.id, user, p, setAlert, resetAlert)
  }

  return (
    <>
      <Message PrefixIconComponent={MdHowToVote} message='投票受付中' />
      <VotedUserIcons votedUsers={votedUsers} roomSize={room.size}/>
      <FibonacciCards onClick={handleClickVoteCard} showWallaby={true} myPoint={myPoint}/>
      <ResetButton roomId={room.id} />
    </>
  )
}

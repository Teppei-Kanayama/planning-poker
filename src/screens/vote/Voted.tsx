/* eslint-disable no-use-before-define */
import React from 'react'
import { MdCoffee } from 'react-icons/md'

import { FibonacciCards } from '../../components/Cards'
import { VoteButton } from '../../components/Button'
import { useMyPoint } from '../../hooks/votes'
import { Message } from '../../components/Message'
import { Room, User } from '../../types'
import { VotedUserIcons } from '../../components/VotedUserIcons'

export const Voted = ({ room, user, votedUsers }: {room: Room, user: User, votedUsers: User[]}) => {
  const [myPoint] = useMyPoint(room.id, user.id)

  return (
  <>
    <Message PrefixIconComponent={MdCoffee} message={'他の人が投票を終えるまでお待ちください'}/>
    <VotedUserIcons votedUsers={votedUsers} roomSize={room.size}/>
    <FibonacciCards disabled myPoint={myPoint} showWallaby={true}/>
    <VoteButton disabled />
  </>)
}

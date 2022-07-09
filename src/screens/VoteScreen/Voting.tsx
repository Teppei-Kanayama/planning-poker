import React from 'react'
import { MdHowToVote } from 'react-icons/md'

import { addVote } from '../../data/firebase'
import { FibonacciCards } from './components/Cards'
import { Message } from './components/Message'
import { Room, User } from '../../types'
import { useAlertContext } from '../../hooks/alert'
import { useMyPoint } from './hooks/votes'
import { ResetButton } from './components/Button'
import { UserIcon } from './components/UserIcon'

export const Voting = ({ room, user, votedUsers }: {room: Room, user: User, votedUsers: User[]}) => {
  const [myPoint] = useMyPoint(room.id, user.id)
  const { setAlert, resetAlert } = useAlertContext()

  const handleClickVoteCard = async (p: number) => {
    await addVote(room.id, user, p, setAlert, resetAlert)
  }

  return (
    <>
      <Message PrefixIconComponent={MdHowToVote} message='投票受付中' />
      <div style={{ display: 'flex', marginLeft: '1rem', fontSize: '1.5em' }}>
        投票済みユーザー：
        {
          votedUsers.length > 0
            ? (
                votedUsers.map((user) => {
                  return <UserIcon key={user.id} user={user} style={{ height: '2rem', margin: '0.2rem' }}/>
                })
              )
            : <>なし</>
        }
      </div>
      <FibonacciCards onClick={handleClickVoteCard} myPoint={myPoint}/>
      <ResetButton roomId={room.id} />
    </>
  )
}

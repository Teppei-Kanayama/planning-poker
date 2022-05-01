/* eslint-disable no-use-before-define */
import React from 'react'
import { User } from '../types'
import { UserIcon } from './UserIcon'

export const VotedUserIcons = ({ votedUsers, roomSize }: {votedUsers: User[], roomSize: number}) => {
  return (
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
  )
}

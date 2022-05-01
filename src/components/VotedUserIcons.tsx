/* eslint-disable no-use-before-define */
import React from 'react'
import { MdAccountCircle } from 'react-icons/md'
import ReactTooltip from 'react-tooltip'
import { User } from '../types'

export const VotedUserIcons = ({ votedUsers, roomSize }: {votedUsers: User[], roomSize: number}) => {
  return (
    <div style={{ display: 'flex', marginLeft: '1rem', fontSize: '1.5em' }}>
      投票済みユーザー：
    {
       votedUsers.length > 0
         ? (
             votedUsers.map((user) => {
               const style = { height: '2rem', margin: '0.2rem' }
               if (user.iconUrl == null) {
                 return <MdAccountCircle key={user.id} style={style}/>
               }
               return (
                 <>
                  <img key={user.id} src={user.iconUrl} style={style} data-tip="hello world"/>
                  <ReactTooltip />
                 </>
               )
             })
           )
         : <>0人</>
    }
     / {roomSize}人
    </div>
  )
}

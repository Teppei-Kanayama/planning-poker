/* eslint-disable no-use-before-define */
import React from 'react'
import { MdAccountCircle } from 'react-icons/md'
import ReactTooltip from 'react-tooltip'

export const VotedUserIcons = ({ votedUserIconUrls, roomSize }: {votedUserIconUrls: string[], roomSize: number}) => {
  return (
    <div style={{ display: 'flex', marginLeft: '1rem', fontSize: '1.5em' }}>
      投票済みユーザー：
    {
       votedUserIconUrls.length > 0
         ? (
             votedUserIconUrls.map((url) => {
               const style = { height: '2rem', margin: '0.2rem' }
               if (url === '') {
                 return <MdAccountCircle key={url} style={style}/>
               }
               return (
                 <>
                  <img key={url} src={url} style={style} data-tip="hello world"/>
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

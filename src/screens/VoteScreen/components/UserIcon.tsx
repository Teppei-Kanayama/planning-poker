import React from 'react'
import { MdAccountCircle } from 'react-icons/md'
import ReactTooltip from 'react-tooltip'
import { User } from '../../../types'

export const UserIcon = ({ user, style }: {user: User, style: React.CSSProperties}) => {
  if (user.iconUrl == null) {
    return <MdAccountCircle key={user.id} style={style}/>
  }
  return (
  <div key={user.id}>
    <img src={user.iconUrl} style={style} data-tip={user.name}/>
    <ReactTooltip />
  </div>
  )
}

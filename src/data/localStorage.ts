/* eslint-disable no-use-before-define */
import { v4 as uuidv4 } from 'uuid'

export const getUserId = () => {
  let userId: string
  const storedUserId = localStorage.getItem('userId')
  if (storedUserId == null) {
    userId = uuidv4()
    localStorage.setItem('userId', userId)
  } else {
    userId = storedUserId
  }
  return userId
}

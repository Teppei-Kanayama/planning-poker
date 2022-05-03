import { useEffect, useState } from 'react'

import { fetchAllVotes, findVote } from '../data/firebase'
import { Vote } from '../types'
import { useAlertContext } from './alert'

// 自分が投票したポイントを管理するカスタムフック
export const useMyPoint = (roomId: string, userId: string) => {
  const [myPoint, setMyPoint] = useState<number>()
  const { setAlert, resetAlert } = useAlertContext()

  useEffect(() => {
    const setExistingPoint = async () => {
      const vote = await findVote(roomId, userId, setAlert, resetAlert)
      if (vote != null) {
        setMyPoint(vote.point)
      }
    }
    setExistingPoint()
  }, [])

  return [myPoint] as const
}

export const useAllVotes = (roomId: string) => {
  const [votes, setVotes] = useState<Vote[]>([])
  const { setAlert, resetAlert } = useAlertContext()

  useEffect(() => {
    const setAllVotes = async () => {
      const allVotes = await fetchAllVotes(roomId, setAlert, resetAlert)
      if (allVotes != null) {
        setVotes(allVotes)
      }
    }
    setAllVotes()
  }, [])

  return [votes] as const
}

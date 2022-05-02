import { useEffect, useState } from 'react'

import { fetchAllVotes, findVote } from '../data/firebase'
import { Vote } from '../types'

// 自分が投票したポイントを管理するカスタムフック
export const useMyPoint = (roomId: string, userId: string) => {
  const [myPoint, setMyPoint] = useState<number>()

  useEffect(() => {
    const setExistingPoint = async () => {
      const vote = await findVote(roomId, userId)
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

  useEffect(() => {
    const setAllVotes = async () => {
      const allVotes = await fetchAllVotes(roomId)
      setVotes(allVotes)
    }
    setAllVotes()
  }, [])

  return [votes] as const
}

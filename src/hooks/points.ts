import { useEffect, useState } from 'react'

import { findVote } from '../data/firebase'

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

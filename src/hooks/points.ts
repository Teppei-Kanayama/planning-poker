import { useEffect, useState } from 'react'

import { fetchAllPoints, findVote } from '../data/firebase'

// 自分が投票したポイントを管理するカスタムフック
export const useMyPoint = (roomId: string, userId: string) => {
  const [myPoint, setMyPoint] = useState<number>()

  useEffect(() => {
    const setExistingPoint = async () => {
      const vote = await findVote(roomId, userId)
      if (vote != null) {
        // TODO: pointがanyになってしまっている
        setMyPoint(vote.point)
      }
    }
    setExistingPoint()
  }, [])

  return [myPoint] as const
}

export const useAllPoints = (roomId: string) => {
  const [points, setPoints] = useState<number[]>([])

  useEffect(() => {
    const setAllPoints = async () => {
      const allPoints = await fetchAllPoints(roomId)
      setPoints(allPoints)
    }
    setAllPoints()
  }, [])

  return [points] as const
}

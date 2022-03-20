/* eslint-disable no-use-before-define */
import React from 'react'

const VoteCard = ({ point, onClick }: {point: number, onClick: (p: number) => void}) => {
  return (
    <button onClick={() => { onClick(point) }}>{point}</button>
  )
}

export const VoteCards = ({ points, onClick }: {points: number[], onClick: (p: number) => void}) => {
  return (
    <>
    {points.map((i) => {
      return (
      <VoteCard
        key={i}
        point={i}
        onClick={onClick}
      />
      )
    })}
  </>
  )
}

export const FibonacciCards = ({ onClick }: {onClick: (p: number) => void}) => {
  const fibonacci = [0, 1, 2, 3, 5, 8, 13, 21]
  return <VoteCards points={fibonacci} onClick={onClick} />
}

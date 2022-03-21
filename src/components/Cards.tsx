/* eslint-disable no-use-before-define */
import React from 'react'

const VoteCard = ({ point, onClick, disabled }:
   {point: number, onClick?: (p: number) => void, disabled?: boolean}) => {
  return (
    <button
      onClick={() => { onClick && onClick(point) }}
      disabled={disabled}>
    {point}
    </button>
  )
}

export const VoteCards = ({ points, onClick, disabled }:
   {points: number[], onClick?: (p: number) => void, disabled?: boolean}) => {
  return (
    <>
    {points.map((i) => {
      return (
      <VoteCard
        key={i}
        point={i}
        onClick={onClick}
        disabled={disabled}
      />
      )
    })}
  </>
  )
}

export const FibonacciCards = ({ onClick, disabled }:
   {onClick?: (p: number) => void, disabled?: boolean}) => {
  const fibonacci = [0, 1, 2, 3, 5, 8, 13, 21]
  return <VoteCards points={fibonacci} onClick={onClick} disabled={disabled}/>
}

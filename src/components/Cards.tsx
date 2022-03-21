/* eslint-disable no-use-before-define */
import React from 'react'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'

export const VoteCards = ({ points, onClick, disabled }:
   {points: number[], onClick?: (p: number) => void, disabled?: boolean}) => {
  return (
    <ButtonGroup size="lg" className="mb-2" style={{ height: '5rem' }}>
    {points.map((point) => {
      return (
        <Button
          key={point}
          onClick={() => { onClick && onClick(point) }}
          disabled={disabled}
          variant="outline-dark"
          style={{ width: '4rem' }}>
          {point}
        </Button>
      )
    })}
  </ButtonGroup>
  )
}

export const FibonacciCards = ({ onClick, disabled }:
   {onClick?: (p: number) => void, disabled?: boolean}) => {
  const fibonacci = [0, 1, 2, 3, 5, 8, 13, 21]
  return <VoteCards points={fibonacci} onClick={onClick} disabled={disabled}/>
}

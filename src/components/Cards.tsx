/* eslint-disable no-use-before-define */
import React from 'react'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'

export const VoteCards = ({ points, onClick, disabled, myPoint }:
   {points: number[], onClick?: (p: number) => void, disabled?: boolean, myPoint?: number}) => {
  return (
    <ButtonGroup size="lg" className="mb-2" style={{ height: '5rem' }}>
    {points.map((point) => {
      const variant = (myPoint && myPoint === point) ? 'dark' : 'outline-dark'
      return (
        <Button
          key={point}
          onClick={() => { onClick && onClick(point) }}
          disabled={disabled}
          variant={variant}
          style={{ width: '4rem' }}>
          {point}
        </Button>
      )
    })}
  </ButtonGroup>
  )
}

export const FibonacciCards = ({ onClick, disabled, myPoint }:
   {onClick?: (p: number) => void, disabled?: boolean, myPoint?: number}) => {
  const fibonacci = [0, 1, 2, 3, 5, 8, 13, 21]
  return <VoteCards points={fibonacci} onClick={onClick} disabled={disabled} myPoint={myPoint}/>
}

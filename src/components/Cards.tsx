/* eslint-disable no-use-before-define */
import React, { useState } from 'react'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'

export const VoteCards = ({ points, onClick, disabled, myPoint, showWallaby }:
   {points: number[], onClick?: (p: number) => void, disabled?: boolean, myPoint?: number, showWallaby?: boolean}) => {
  const [wallabyMessageOpen, setWallabyMessageOpen] = useState(false)
  return (
      <>
        <ButtonGroup size="lg" className="mb-2" style={{ height: '8rem', padding: '1rem' }}>
          {points.map((point) => {
            const variant = (myPoint != null && myPoint === point) ? 'dark' : 'outline-dark'
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
          {
            showWallaby && (
              <>
                <Button
                  onClick={() => { setWallabyMessageOpen(true) }}
                  disabled={disabled}
                  variant='outline-dark'
                  style={{ width: '4rem' }}>
                  <img src='wallaby.png' alt="Logo" style={{ width: '3.5rem', marginLeft: '-0.7rem' }} />
                </Button>
                {wallabyMessageOpen && '< wallabyだよ。投票に集中してね。'}
              </>
            )
          }
        </ButtonGroup>
        <br />
    </>
  )
}

export const FibonacciCards = ({ onClick, disabled, myPoint, showWallaby }:
   {onClick?: (p: number) => void, disabled?: boolean, myPoint?: number, showWallaby?: boolean}) => {
  const fibonacci = [0, 1, 2, 3, 5, 8, 13, 21]
  return <VoteCards points={fibonacci} onClick={onClick} disabled={disabled} myPoint={myPoint} showWallaby={showWallaby}/>
}

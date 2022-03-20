/* eslint-disable no-use-before-define */
import React, { ChangeEvent, useState } from 'react'

export const SetupScreen = () => {
  const [size, setSize] = useState(0)
  const [roomUrl, setRoomUrl] = useState<string>()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSize(parseInt(event.target.value))
  }

  const handleClick = () => {
    setRoomUrl(`${location.protocol}//${location.host}/room?id=100&size=${size}`)
  }

  return (
    <div className="App">
      <h1>新しい部屋を作成しよう！</h1>

      <label>
        参加人数:
        <input type="number" name="name" onChange={handleChange} />
      </label>

      <button onClick={handleClick}>作成する</button>

      {
        roomUrl && (
          <>
            <br />
            <>{roomUrl}</>
            <br />
            <a href={roomUrl} target="_blank" rel="noreferrer">部屋に移動する</a>
          </>
        )
      }
    </div>
  )
}

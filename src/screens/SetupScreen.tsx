/* eslint-disable no-use-before-define */
import React, { ChangeEvent, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

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
        人
      </label>

      <button onClick={handleClick}>作成する</button>

      {
        roomUrl && (
          <>
            <br />
            作成されました！
            <br />
            <a href={roomUrl} target="_blank" rel="noreferrer">{roomUrl}</a>
            <CopyToClipboard text={roomUrl}><button>クリップボードにコピー</button></CopyToClipboard>
          </>
        )
      }
    </div>
  )
}

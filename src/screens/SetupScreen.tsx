/* eslint-disable no-use-before-define */
import React, { ChangeEvent, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { v4 as uuidv4 } from 'uuid'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { SignOutButton } from '../components/Button'

export const SetupScreen = () => {
  const [size, setSize] = useState('')
  const [roomUrl, setRoomUrl] = useState<string>()
  const [copied, setCopied] = useState(false)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSize(event.target.value)
  }

  const handleClick = () => {
    const roomId = uuidv4()
    setRoomUrl(`${location.protocol}//${location.host}/room?id=${roomId}&size=${size}`)
  }

  return (
    <>
      <SignOutButton />
      <h1 style={{ justifyContent: 'center', display: 'flex', fontWeight: 'bold', marginBottom: '2rem' }}>新規投票所の作成</h1>

      <Form.Group className="mb-3" style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center' }}>
        <Form.Label style={{ display: 'flex', alignItems: 'end' }}>参加人数</Form.Label>
        <Form.Control type="number" onChange={handleChange} style={{ width: '5rem', marginLeft: '1rem', marginRight: '1rem' }}/>
            人
        <Button
          onClick={handleClick}
          style={{ justifyContent: 'center', display: 'flex', padding: '0.5rem', marginLeft: '3rem' }}
          disabled={!Number.isInteger(parseFloat(size)) || parseInt(size) <= 0}
        >作成する</Button>
      </Form.Group>

      {
        roomUrl && (
          <>
            <br />
            作成されました！
            <br />
            <a href={roomUrl} target="_blank" rel="noreferrer">{roomUrl}</a>
            <CopyToClipboard text={roomUrl} onCopy={() => { setCopied(true) }}>
              <Button>クリップボードにコピー</Button>
            </CopyToClipboard>
            {
              copied && (
                <>
                  コピーされました！
                </>
              )
            }
          </>
        )
      }
    </>
  )
}

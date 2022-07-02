import React, { ChangeEvent, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { v4 as uuidv4 } from 'uuid'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { SignOutButton } from '../components/Button'
import { MdOutlineContentCopy, MdOpenInNew } from 'react-icons/md'

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
      <h1 style={{ display: 'flex', justifyContent: 'center', fontWeight: 'bold', marginBottom: '2rem' }}>新規投票所の作成</h1>

      <Form.Group className='mb-3' style={{ display: 'flex', alignItems: 'center', marginLeft: '1rem' }}>
        <Form.Label style={{ display: 'flex', alignItems: 'end' }}>参加人数</Form.Label>
        <Form.Control type='number' min='1' onChange={handleChange} style={{ width: '5rem', marginLeft: '1rem', marginRight: '1rem' }}/>
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
            <p>
              ↓投票所が作成されました！投票所のリンクを参加者に配布しましょう。
            </p>

            <a href={roomUrl} target='_blank' rel='noreferrer' style={{ padding: '1rem' }}>
              {roomUrl} <MdOpenInNew size={30}/>
            </a>
            <CopyToClipboard text={roomUrl} onCopy={() => { setCopied(true) }}>
              <Button variant='light' size='lg' ><MdOutlineContentCopy/></Button>
            </CopyToClipboard>
            {
              copied && (
                <>
                  copied!
                </>
              )
            }
          </>
        )
      }
    </>
  )
}

import React, { ChangeEvent, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { v4 as uuidv4 } from 'uuid'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { SignOutButton } from '../components/Button'
import { MdOutlineContentCopy, MdOpenInNew } from 'react-icons/md'
import { Container, Navbar } from 'react-bootstrap'

export const SetupScreen = () => {
  const [size, setSize] = useState('')
  const [roomUrl, setRoomUrl] = useState<string>()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSize(event.target.value)
  }

  const handleClick = () => {
    const roomId = uuidv4()
    setRoomUrl(`${location.protocol}//${location.host}/room?id=${roomId}&size=${size}`)
  }

  return (
    <>
      <Navbar bg="success">
        <Container>
          <Navbar.Brand href="#home">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ fontStyle: 'italic', color: 'white' }}>
                Planning Poker
              </div>
              <img
                src="wallaby.png"
                height="50"
                className="d-inline-block align-top"
                alt="logo"
              />
            </div>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <SignOutButton />
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <h1 style={{ display: 'flex', justifyContent: 'center', fontWeight: 'bold', margin: '2rem' }}>投票所の作成</h1>

      <h2 style={{ fontSize: '1.5rem', margin: '1rem' }}>
        1. まずは参加人数を入力し、「作成する」ボタンを押してください。
      </h2>
      <Form.Group style={{ display: 'flex', alignItems: 'center', margin: '2rem' }}>
        <Form.Label>参加人数</Form.Label>
        <Form.Control
          type='number'
          min='1'
          disabled={roomUrl != null}
          onChange={handleChange}
          style={{ width: '5rem', marginLeft: '1rem', marginRight: '1rem' }}/>
        人
        <Button
          onClick={handleClick}
          style={{ display: 'flex', justifyContent: 'center', padding: '0.5rem', marginLeft: '3rem' }}
          disabled={roomUrl != null || !Number.isInteger(parseFloat(size)) || parseInt(size) <= 0}
        >作成する</Button>
      </Form.Group>

      {
        roomUrl && (
          <>
            <h2 style={{ fontSize: '1.5rem', margin: '1rem' }}>2. 投票所のURLを参加者に配布してください。</h2>
            <div style={{ margin: '2rem' }}>
              <CopyToClipboard text={roomUrl}>
                <Button variant='outline-primary' style={{ marginRight: '2rem' }}>投票所のURLをクリップボードにコピー<MdOutlineContentCopy/></Button>
              </CopyToClipboard>
              <Button variant='warning'>投票所の作成をやり直す</Button>
            </div>
            <h2 style={{ fontSize: '1.5rem', margin: '1rem' }}>3. あなたも投票所に移動しましょう！</h2>
            <div style={{ margin: '2rem' }}>
              <Button href={roomUrl} target='_blank'>投票所に移動する<MdOpenInNew size={30}/></Button>
            </div>
          </>
        )
      }
    </>
  )
}

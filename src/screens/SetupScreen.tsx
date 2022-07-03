import React, { ChangeEvent, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { v4 as uuidv4 } from 'uuid'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { MdOutlineContentCopy, MdOpenInNew } from 'react-icons/md'
import { NavigationBar } from '../components/NavigationBar'

const Section = ({ heading, children }: {heading: string, children: React.ReactElement}) => {
  return (
    <>
      <h2 style={{ fontSize: '1.5rem', margin: '1rem' }}>
        {heading}
      </h2>
      <div style={{ margin: '2rem' }}>
        {children}
      </div>
    </>
  )
}

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
      <NavigationBar isSignedIn={true} />
      <h1 style={{ display: 'flex', justifyContent: 'center', fontWeight: 'bold', margin: '2rem' }}>投票所の作成</h1>
      <Section heading={' 1. 参加人数を入力し、投票所を作成してください。'}>
        <Form.Group style={{ display: 'flex', alignItems: 'center' }}>
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
      </Section>
      {
        roomUrl && (
          <>
            <Section heading={' 2. 投票所のURLを参加者に配布してください。'}>
              <>
                <CopyToClipboard text={roomUrl}>
                  <Button variant='outline-primary' style={{ marginRight: '2rem' }}>投票所のURLをクリップボードにコピー<MdOutlineContentCopy/></Button>
                </CopyToClipboard>
                <Button
                  variant='warning'
                  onClick={() => { setRoomUrl(undefined) }}
                >
                  投票所の作成をやり直す
                </Button>
              </>
            </Section>
            <Section heading={'3. あなたも投票所に移動しましょう！'}>
              <Button href={roomUrl} target='_blank'>
                投票所に移動する<MdOpenInNew size={30}/>
              </Button>
            </Section>
          </>
        )
      }
    </>
  )
}

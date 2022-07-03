import React from 'react'
import { Button, Container, Navbar } from 'react-bootstrap'
import { signOut } from '../../data/firebase'

export const NavigationBar = ({ isSignedIn }: { isSignedIn: boolean }) => {
  return (
    <Navbar bg="success">
      <Container>
        <Navbar.Brand href="/">
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
            {
              isSignedIn &&
                (
                <Button
                  variant='success'
                  onClick={
                    () => {
                      signOut()
                      location.reload()
                    }
                  }
                >
                  <span style={{ color: 'white' }}>
                    サインアウト
                  </span>
                </Button>
                )
            }
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

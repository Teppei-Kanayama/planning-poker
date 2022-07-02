import React from 'react'
import { SignOutButton } from './Button'
import { Container, Navbar } from 'react-bootstrap'

export const NavigationBar = () => {
  return (
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
  )
}

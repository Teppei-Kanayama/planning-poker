/* eslint-disable no-use-before-define */
import React from 'react'
import ReactDOM from 'react-dom'

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { SetupScreen } from './screens/SetupScreen'
import { VotingScreen } from './screens/VotingScreen'

ReactDOM.render(
  <BrowserRouter>
    <Link to="/create-new-room">Invoices</Link>
    <Link to="/room">Expenses</Link>
    <Routes>
      <Route path="/create-new-room" element={<SetupScreen />} />
      <Route path="/room" element={<VotingScreen />} />
      <Route path="/" element={<SetupScreen />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
)

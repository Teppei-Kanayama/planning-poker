/* eslint-disable no-use-before-define */
import React from 'react'
import './App.css'
import { vote } from './firebase/firebase'

function App () {
  return (
    <div className="App">
      <h1>
        <button onClick={async () => {
          await vote()
        }}>
          送信
        </button>
      </h1>
    </div>
  )
}

export default App

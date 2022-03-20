/* eslint-disable no-use-before-define */
import React from 'react'

export const SetupScreen = () => {
  console.log(location.protocol)

  return (
    <div className="App">
      <h1>新しい部屋を作成しよう！</h1>
      <a href={`${location.protocol}//${location.host}/room?id=100&size=10`}>部屋に移動する</a>
    </div>
  )
}

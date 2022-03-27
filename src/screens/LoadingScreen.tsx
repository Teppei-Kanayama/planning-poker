/* eslint-disable no-use-before-define */
import React from 'react'
import ReactLoading from 'react-loading'

export const LoadingScreen = () => {
  return (
    <div style={{
      marginTop: '20rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <ReactLoading type="spokes" color="#0000FF" height={200} width={100} />
    </div>
  )
}

// 3rd-party
import Grid from '@mui/material/Grid'
import React from 'react'

// Ours
import logo from '../logo.svg'
import '../App.css'


class Home extends React.Component {
  render = () => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <img src={logo} className="App-logo" alt="logo" />
        </Grid>
      </Grid>
    )
  }
}


export default Home

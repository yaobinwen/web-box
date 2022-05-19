// 3rd-party
import React from 'react'

// Ours
import './App.css'
import Home from './components/Home'
import TopBar from './components/TopBar'

class App extends React.Component {
  render = () => {
    return (
      <div className="App">
        <TopBar></TopBar>
        <Home></Home>
      </div>
    )
  }
}

export default App

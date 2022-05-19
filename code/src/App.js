// 3rd-party
import React from 'react'
import {
  Route,
  Routes,
} from "react-router-dom"

// Ours
import './App.css'
import Home from './components/Home'
import TopBar from './components/TopBar'


class App extends React.Component {
  render = () => {
    return (
      <div className="App">
        <TopBar />
        <Routes>
          <Route path="/" element={
            <Home />
          } />
          <Route path="demo1" element={
            <p>Demo 1</p>
          } />
          <Route path="demo2" element={
            <p>Demo 2</p>
          } />
        </Routes>
      </div>
    )
  }
}


export default App

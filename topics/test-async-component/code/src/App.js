import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import About from './components/About';
import License from './components/License';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <About />
        <License />
      </div>
    );
  }
}

export default App;

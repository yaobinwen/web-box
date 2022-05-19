// 3rd-party
import React from 'react'
import {
  Route,
  Routes,
} from "react-router-dom"

// Ours
import './App.css'
import RouteDefs from './RouteDefs'
import TopBar from './components/TopBar'

class App extends React.Component {
  render = () => {
    return (
      <div className="App">
        <TopBar />
        <Routes>
          {
            RouteDefs.map((routeDef) => (
              <Route
                key={`route-${routeDef.name}`}
                path={routeDef.path} element={routeDef.element}
              />
            ))
          }
        </Routes>
      </div>
    )
  }
}

export default App

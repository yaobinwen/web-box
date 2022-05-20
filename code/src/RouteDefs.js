// 3rd-party
import React from 'react'

// Ours
import DemoMenu from './components/DemoMenu'
import Home from './components/Home'

const RouteDefs = [
  {
    name: "Home",
    path: "/",
    element: (<Home />),
  },
  {
    name: "Demo Menu",
    path: "/demo-menu",
    element: (<DemoMenu />),
  },
]

export default RouteDefs

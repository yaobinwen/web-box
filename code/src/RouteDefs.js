// 3rd-party
import React from 'react'

// Ours
import Home from './components/Home'

const RouteDefs = [
  {
    name: "Home",
    path: "/",
    element: (<Home />),
  },
  {
    name: "Demo 1",
    path: "/demo1",
    element: (<p>Demo 1</p>),
  },
  {
    name: "Demo 2",
    path: "/demo2",
    element: (<p>Demo 2</p>),
  },
]

export default RouteDefs

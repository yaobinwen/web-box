// 3rd-party
import React from 'react'

// Ours
import DemoMenu from './components/DemoMenu'
import DemoProtobuf from './components/DemoProtobuf'
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
  {
    name: "Demo Protobuf (protobuf.js)",
    path: "/demo-protobufjs",
    element: (<DemoProtobuf />),
  },
]

export default RouteDefs

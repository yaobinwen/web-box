// 3rd-party
import React from 'react'

// Ours
import DemoMenu from './components/DemoMenu'
import DemoOverlaidIcon from './components/DemoOverlaidIcon'
import DemoProtobuf from './components/DemoProtobuf'
import DemoProtobufGoogle from './components/DemoProtobufGoogle'
import DemoWVSSnapshot from './components/DemoWVSSnapshot'
import DemoImageParsing from './components/DemoImageParsing'
import DemoDownloadLargeFiles from './components/DemoDownloadLargeFiles'
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
    name: "Demo Overlaid Icon",
    path: "/demo-overlaid-icon",
    element: (<DemoOverlaidIcon />),
  },
  {
    name: "Demo Protobuf (protobuf.js)",
    path: "/demo-protobufjs",
    element: (<DemoProtobuf />),
  },
  {
    name: "Demo Protobuf (google-protobuf)",
    path: "/demo-google-protobuf",
    element: (<DemoProtobufGoogle />),
  },
  {
    name: "Demo WVS Snapshot",
    path: "/demo-wvs-snapshot",
    element: (<DemoWVSSnapshot />),
  },
  {
    name: "Demo Image Parsing",
    path: "/demo-image-parsing",
    element: (<DemoImageParsing />),
  },
  {
    name: "Demo Download Large Files",
    path: "/demo-download-large-files",
    element: (<DemoDownloadLargeFiles />),
  },
]

export default RouteDefs

// 3rd-party
import React from "react";

// Ours
import Home from "./components/Home";
import DemoDownloadLargeFiles from "./components/DemoDownloadLargeFiles";
import DemoFunctionalComponent from "./components/DemoFunctionalComponent";
import DemoImageParsing from "./components/DemoImageParsing";
import DemoLongPolling from "./components/DemoLongPolling";
import DemoMenu from "./components/DemoMenu";
import DemoMUI from "./components/DemoMUI";
import DemoMUILegacyStyling from "./components/DemoMUILegacyStyling";
import DemoOverlaidIcon from "./components/DemoOverlaidIcon";
import DemoProtobuf from "./components/DemoProtobuf";
import DemoProtobufGoogle from "./components/DemoProtobufGoogle";
import DemoTicTacToe from "./components/DemoTicTacToe";
import DemoWVSSnapshot from "./components/DemoWVSSnapshot";

const RouteDefs = [
  {
    name: "Home",
    path: "/",
    element: <Home />,
  },
  {
    name: "Demo Download Large Files",
    path: "/demo-download-large-files",
    element: <DemoDownloadLargeFiles />,
  },
  {
    name: "Demo Functional Components",
    path: "/demo-functional-components",
    element: <DemoFunctionalComponent />,
  },
  {
    name: "Demo Image Parsing",
    path: "/demo-image-parsing",
    element: <DemoImageParsing />,
  },
  {
    name: "Demo Long Polling",
    path: "/demo-long-polling",
    element: <DemoLongPolling />,
  },
  {
    name: "Demo Menu",
    path: "/demo-menu",
    element: <DemoMenu />,
  },
  {
    name: "Demo MUI",
    path: "/demo-mui",
    element: <DemoMUI />,
  },
  {
    name: "Demo MUI Legacy Styling",
    path: "/demo-mui-legacy-styling",
    element: <DemoMUILegacyStyling />,
  },
  {
    name: "Demo Overlaid Icon",
    path: "/demo-overlaid-icon",
    element: <DemoOverlaidIcon />,
  },
  {
    name: "Demo Protobuf (protobuf.js)",
    path: "/demo-protobufjs",
    element: <DemoProtobuf />,
  },
  {
    name: "Demo Protobuf (google-protobuf)",
    path: "/demo-google-protobuf",
    element: <DemoProtobufGoogle />,
  },
  {
    name: "Demo Tic Tac Toe",
    path: "/demo-tic-tac-toe",
    element: <DemoTicTacToe />,
  },
  {
    name: "Demo WVS Snapshot",
    path: "/demo-wvs-snapshot",
    element: <DemoWVSSnapshot />,
  },
];

export default RouteDefs;

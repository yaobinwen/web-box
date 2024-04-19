// 3rd-party
import Box from "@mui/material/Box";
import FlashlightOffIcon from "@mui/icons-material/FlashlightOff";
import FlashlightOnIcon from "@mui/icons-material/FlashlightOn";
import HelpIcon from "@mui/icons-material/Help";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import React, { useState } from "react";

// Ours
import URLInput from "../URLInput";

const DEFAULT_BACKEND_URL = "http://localhost:20361";

const SWITCH_STATE_OFF = 0;
const SWITCH_STATE_ON = 1;

function Flashlight({ state, size }) {
  let icon = null;

  switch (state) {
    case SWITCH_STATE_ON:
      icon = <FlashlightOnIcon sx={{ fontSize: size }} />;
      break;
    case SWITCH_STATE_OFF:
      icon = <FlashlightOffIcon sx={{ fontSize: size }} />;
      break;
    default:
      icon = <HelpIcon sx={{ fontSize: size }} />;
      break;
  }

  return <>{icon}</>;
}

function DemoSubPubLongPoll() {
  const [targetURL, setTargetURL] = useState(DEFAULT_BACKEND_URL);
  const [switchState, setSwitchState] = useState(null);
  const [pollResponse, setPollResponse] = useState(null);

  const handleURLChange = (newURL) => {
    setTargetURL(newURL);
  };

  const handleClickStartLongPolling = () => {
    let endpoint;

    console.debug("Getting current switch status...");
    endpoint = targetURL + "/switch/status";
    axios.get(endpoint).then((response) => {
      console.debug("Switch status is fetched");
      const status = parseInt(response.data);
      setSwitchState(status);
    });

    console.debug("Starting long polling...");
    endpoint = targetURL + "/switch/poll";
    axios.get(endpoint).then((response) => {
      console.debug("Long polling is done");
      setPollResponse(response);
    });
  };

  const handleClickSwitchOn = () => {
    const endpoint = targetURL + "/switch/status";
    const d = "1";
    axios
      .post(endpoint, d)
      .then((response) => {
        console.debug(`Posting '${d}' to '${endpoint}': `, response);
      })
      .then(() => {
        return axios.get(endpoint);
      })
      .then((response) => {
        const status = parseInt(response.data);
        setSwitchState(status);
      });
  };

  const handleClickSwitchOff = () => {
    const endpoint = targetURL + "/switch/status";
    const d = "0";
    axios
      .post(endpoint, d)
      .then((response) => {
        console.debug(`Posting '${d}' to '${endpoint}': `, response);
      })
      .then(() => {
        return axios.get(endpoint);
      })
      .then((response) => {
        const status = parseInt(response.data);
        setSwitchState(status);
      });
  };

  return (
    <>
      <h3>
        (This demo requires the run of the Tornado Box
        `subcmd_srv_pub_sub_long_poll`.)
      </h3>
      <URLInput
        defaultURL={DEFAULT_BACKEND_URL}
        buttonCaption={"Start long polling"}
        buttonIcon={<SendIcon />}
        onButtonClick={() => handleClickStartLongPolling()}
        onURLChange={(event) => handleURLChange(event.target.value)}
      />
      <Box>
        <p>Flashlight state:</p>
        <Flashlight state={switchState} size={80} />
      </Box>
      <Box>
        <Button
          variant="outlined"
          sx={{ m: 2 }}
          onClick={() => handleClickSwitchOn()}
        >
          Switch on
        </Button>
        <Button
          variant="outlined"
          sx={{ m: 2 }}
          onClick={() => handleClickSwitchOff()}
        >
          Switch off
        </Button>
      </Box>
      <Box>
        <p>Polling response:</p>
        {JSON.stringify(pollResponse)}
      </Box>
    </>
  );
}

export { DemoSubPubLongPoll };

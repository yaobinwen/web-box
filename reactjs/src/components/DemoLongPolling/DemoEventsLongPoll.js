// 3rd-party
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import TextField from "@mui/material/TextField";
import axios from "axios";
import React, { useState } from "react";

function DemoEventsLongPoll({
  backend_root_url_default,
  poll_timeout_s_default,
}) {
  const [rootURL, setRootURL] = useState(backend_root_url_default);
  const [pollTimeout, setPollTimeout] = useState(poll_timeout_s_default);
  const [pollStatus, setPollStatus] = useState(null);

  const textFieldStyles = {
    margin: 1,
  };

  const handleRootURLChange = (newURL) => {
    setRootURL(newURL);
  };

  const handleTimeoutChange = (newTimeout) => {
    setPollTimeout(parseInt(newTimeout));
  };

  const handleClickStartLongPolling = () => {
    let endpoint;

    endpoint = rootURL + `/events/poll?timeout-in-s=${pollTimeout}`;
    setPollStatus(
      `Polling events at ${endpoint} (timeout: ${pollTimeout}s)...`
    );
    axios
      .get(endpoint)
      .then((response) => {
        setPollStatus(`${response.status} (${response.statusText})`);
      })
      .catch((error) => {
        setPollStatus(
          `${error.response.status} (${error.response.statusText})`
        );
      });
  };

  return (
    <>
      <h3>
        (This demo requires the run of the Tornado Box
        `subcmd_srv_events_long_poll`.)
      </h3>
      <Box sx={textFieldStyles}>
        <TextField
          label="URL"
          required
          type="url"
          defaultValue={backend_root_url_default}
          onClick={(event) => handleRootURLChange(event.target.value)}
        />
      </Box>
      <Box sx={textFieldStyles}>
        <TextField
          label="Timeout (s)"
          required
          type="number"
          defaultValue={3}
          onClick={(event) => handleTimeoutChange(event.target.value)}
        />
      </Box>
      <Box>
        <Button
          variant="contained"
          size="large"
          endIcon={<SendIcon />}
          onClick={() => handleClickStartLongPolling()}
        >
          Start Polling
        </Button>
      </Box>
      <Box>
        <p>Polling status:</p>
        {pollStatus}
      </Box>
    </>
  );
}

export { DemoEventsLongPoll };

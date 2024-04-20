// 3rd-party
import Grid from "@mui/material/Grid";
import React from "react";

// Ours
import { DemoSubPubLongPoll } from "./DemoLongPolling/DemoSubPubLongPoll";
import { DemoEventsLongPoll } from "./DemoLongPolling/DemoEventsLongPoll";

const DEFAULT_BACKEND_ROOT_URL = "http://localhost:20361";

function DemoLongPolling() {
  const gridStyles = {
    border: "2px solid grey",
    marginTop: 5,
    paddingTop: 2.5,
    paddingBottom: 2.5,
  };

  return (
    <>
      <h1>Demo Long Polling</h1>
      <Grid container>
        <Grid item xs={6} sx={gridStyles}>
          <DemoSubPubLongPoll
            backend_root_url_default={DEFAULT_BACKEND_ROOT_URL}
          />
        </Grid>
        <Grid item xs={6} sx={gridStyles}>
          <DemoEventsLongPoll
            backend_root_url_default={DEFAULT_BACKEND_ROOT_URL}
            poll_timeout_s_default={3}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default DemoLongPolling;

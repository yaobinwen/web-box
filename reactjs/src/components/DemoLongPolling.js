// 3rd-party
import Grid from "@mui/material/Grid";
import React from "react";

// Ours
import { DemoSubPubLongPoll } from "./DemoLongPolling/DemoSubPubLongPoll";

function DemoLongPolling() {
  const gridStyles = {
    border: "2px solid grey",
    paddingTop: 2.5,
    paddingBottom: 2.5,
  };

  return (
    <>
      <h1>Demo Long Polling</h1>
      <Grid container>
        <Grid item xs={6} sx={gridStyles}>
          <DemoSubPubLongPoll />
        </Grid>
      </Grid>
    </>
  );
}

export default DemoLongPolling;

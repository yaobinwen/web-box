// 3rd-party
import * as React from "react";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

function DemoProgressCircular() {
  return (
    <>
      <h1>Demo circular progress</h1>
      <Stack spacing={2} sx={{ flexGrow: 1 }}>
        <CircularProgress />
      </Stack>
    </>
  );
}

export default DemoProgressCircular;

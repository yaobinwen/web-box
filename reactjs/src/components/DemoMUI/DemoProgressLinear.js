import * as React from "react";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";

function LinearProgressDetermined1() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    setTimeout(() => {
      setProgress((progress + 1) % 100);
    }, 100);
  }, [progress]);

  return (
    <LinearProgress
      style={{ height: 10, borderRadius: 5 }}
      variant="determinate"
      value={progress}
    />
  );
}

function LinearProgressIndetermined1() {
  return (
    <LinearProgress
      style={{ height: 10, borderRadius: 5 }}
      variant="indeterminate"
    />
  );
}

function DemoProgressLinear() {
  return (
    <>
      <h1>Demo linear progress</h1>
      <Stack spacing={2} sx={{ flexGrow: 1 }}>
        <LinearProgressDetermined1 />
        <LinearProgressIndetermined1 />
      </Stack>
    </>
  );
}

export default DemoProgressLinear;

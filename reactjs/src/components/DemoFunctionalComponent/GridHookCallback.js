// 3rd-party
import Button from "@mui/material/Button";
import React, { useCallback, useState } from "react";

function renderCounter() {
  let count = 0;

  return function () {
    count++;
    return count;
  };
}

const GridHookCallback_renderCounter = renderCounter();

function GridHookCallback() {
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState(1);
  const [status2, setStatus2] = useState(1);

  // The callback function `showStatus` remains the same across re-renderings
  // if `status` has not been updated. A new function `showStatus` is created
  // if `status` was updated in the previous rendering.
  const showStatus = useCallback(() => {
    return (
      <>
        <p>Status: {status}</p>
      </>
    );
  }, [status]);

  // NOTE(ywen): `printStatus` is correctly re-created every time `status` gets
  // updated. However, the `printStatus` that `setTimeout` calls refers to the
  // `printStatus` that uses the current value of `status`. Therefore, even if
  // `status` may get updated after `printStatus` is called, the `printStatus`
  // that `setTimeout` calls is still the one with the old `status` value.
  const setStatus2Repeatedly = useCallback(() => {
    if (status2 !== status) {
      setStatus2(status);
    }
    setTimeout(setStatus2Repeatedly, 1000);
  }, [status, status2]);

  function handleClickCount() {
    setCount(count + 1);
  }

  function handleClickStatus() {
    setStatus(status + 1);
  }

  function handleClickUpdateStatus2() {
    setStatus2Repeatedly();
  }

  return (
    <>
      <p>Render count: {GridHookCallback_renderCounter()}</p>
      {showStatus()}
      <p>Status2: {status2}</p>
      <Button
        variant="contained"
        size="large"
        onClick={handleClickCount}
        style={{ textTransform: "lowercase" }}
      >
        Re-render (w/o changing status)
      </Button>
      <Button
        variant="contained"
        size="large"
        onClick={handleClickStatus}
        style={{ textTransform: "lowercase" }}
      >
        Re-render (w/ changing status)
      </Button>
      <Button
        variant="contained"
        size="large"
        onClick={handleClickUpdateStatus2}
        style={{ textTransform: "lowercase" }}
      >
        Update status2
      </Button>
      <div>
        <p>Step 1: Click "Re-render (w/o changing status)" a few times.</p>
        <p>Step 2: Click "Re-render (w/ changing status)" a few times.</p>
        <p>Step 3: Click "Update status2" a few times.</p>
        <p>Step 4: Repeat steps 1~3 a few times.</p>
        <p>Step 5: See how "Status2" jumps among the different numbers.</p>
      </div>
    </>
  );
}

export default GridHookCallback;

// 3rd-party
import Button from "@mui/material/Button";
import React, { useState } from "react";

function MySharedCountingButton({ count, onClick }) {
  return (
    <Button
      variant="contained"
      size="large"
      onClick={onClick}
      style={{ textTransform: "lowercase" }}
    >
      Click me ({count} time(s) so far)
    </Button>
  );
}

function GridSharedCountingButtons() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <>
      <p>Buttons that shared the counter</p>
      <div>
        <MySharedCountingButton count={count} onClick={handleClick} />
      </div>
      <div>
        <MySharedCountingButton count={count} onClick={handleClick} />
      </div>
    </>
  );
}

export default GridSharedCountingButtons;

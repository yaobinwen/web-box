// 3rd-party
import Button from "@mui/material/Button";
import React, { useState } from "react";

function MySeparateCountingButton() {
  // `useState`:
  // Args:
  //   - The variable's initial value.
  // Returns:
  //   - The variable.
  //   - The variable's setter function.
  const [count, setCount] = useState(0);

  // You can define an event handler function inside your components.
  function handleClick() {
    setCount(count + 1);
  }

  return (
    <Button
      variant="contained"
      size="large"
      onClick={handleClick}
      style={{ textTransform: "lowercase" }}
    >
      Click me ({count} time(s) so far)
    </Button>
  );
}

function GridSeparateCountingButtons() {
  return (
    <>
      <p>Buttons that count separately</p>
      <div>
        <MySeparateCountingButton />
      </div>
      <div>
        <MySeparateCountingButton />
      </div>
    </>
  );
}

export default GridSeparateCountingButtons;

// 3rd-party
import { FormControl, FormControlLabel, FormGroup } from "@mui/material";
import React, { useState } from "react";
import Switch from "@mui/material/Switch";

function DemoSwitch() {
  const [state, setState] = useState(false);

  const handleChange = (event) => {
    setState(event.target.checked);
  };

  return (
    <>
      <FormControl component="fieldset">
        <FormGroup>
          <FormControlLabel
            control={
              <Switch checked={state} onChange={handleChange} name="state" />
            }
            label={JSON.stringify(state)}
          />
        </FormGroup>
      </FormControl>
    </>
  );
}

export default DemoSwitch;

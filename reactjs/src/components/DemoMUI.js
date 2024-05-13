// 3rd-party
import Grid from "@mui/material/Grid";
import React from "react";

// Ours
import DemoAccordionList from "./DemoMUI/DemoAccordionList";
import DemoSwitch from "./DemoMUI/DemoSwitch";

function DemoMUI() {
  return (
    <>
      <h1>Demo MUI components</h1>
      <Grid container spacing={2} sx={{ paddingTop: 2.5, paddingBottom: 2.5 }}>
        <Grid item xs={4} sx={{ border: "2px solid grey", paddingBottom: 2.5 }}>
          <DemoSwitch />
        </Grid>
        <Grid item xs={4} sx={{ border: "2px solid grey", paddingBottom: 2.5 }}>
          <DemoAccordionList />
        </Grid>
      </Grid>
    </>
  );
}

export default DemoMUI;

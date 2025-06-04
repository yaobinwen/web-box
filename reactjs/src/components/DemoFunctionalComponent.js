// 3rd-party
import Grid from "@mui/material/Grid";
import React from "react";

// Ours
import GridSeparateCountingButtons from "./DemoFunctionalComponent/GridSeparateCountingButtons";
import GridSharedCountingButtons from "./DemoFunctionalComponent/GridSharedCountingButtons";

/**
 * All about hooks:
 * - Functions starting with `use` are called Hooks.
 * - You can only call Hooks at the top of your components (or other Hooks).
 *   - If you want to use useState in a condition or a loop, extract a new
 *     component and put it there.
 */

function DemoFunctionalComponent() {
  return (
    <>
      <h1>Demo of functional components</h1>
      <p>
        All the components on this page are implemented as functions instead of
        classes.
      </p>
      <h3>But the more powerful part is the use of React.js hooks.</h3>
      <h3>
        Main reference:{" "}
        <a href="https://react.dev/learn" target="_blank" rel="noreferrer">
          react.dev/learn
        </a>
      </h3>
      <Grid
        container
        spacing={2}
        sx={{ border: "2px solid grey", paddingTop: 2.5, paddingBottom: 2.5 }}
      >
        <Grid item xs={6} sx={{ border: "2px solid grey", paddingBottom: 2.5 }}>
          {GridSeparateCountingButtons()}
        </Grid>
        <Grid item xs={6} sx={{ border: "2px solid grey", paddingBottom: 2.5 }}>
          {GridSharedCountingButtons()}
        </Grid>
      </Grid>
    </>
  );
}

export default DemoFunctionalComponent;

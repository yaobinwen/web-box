// 3rd-party
import { Box, Button } from "@mui/material";
import React from "react";

function DemoFlexAlignment() {
  return (
    <>
      {/**
       * The point is to use the top-level <Box> to set the flex styles so
       * they align the <Box> in the second level to the right, so everything
       * in the second-level <Box> is also **generally** aligned to the right.
       */}
      <Box
        style={{
          display: "flex",
          justifyContent: "right",
          alignItems: "right",
          borderStyle: "dashed",
          borderWidth: 2,
        }}
      >
        <Box
          style={{
            borderStyle: "dashed",
            borderWidth: 2,
            margin: 2,

            /**
             * However, the elements inside the second-level <Box> are not
             * aligned to the right. The default alignment is probably "center",
             * so we need to use `textAlign` (or `text-align`) to align them
             * to the right.
             */
            textAlign: "right",
          }}
        >
          <Box>
            <Button>One</Button>
            <Button>Two</Button>
          </Box>
          <Box>
            <Button>Three</Button>
          </Box>
          <Box>something one</Box>
          <Box>something two</Box>
        </Box>
      </Box>
      <Box
        style={{
          display: "flex",
          justifyContent: "right",
          alignItems: "right",
          borderStyle: "dashed",
          borderWidth: 2,
        }}
      >
        <Box
          style={{
            borderStyle: "dashed",
            borderWidth: 2,
            margin: 2,
          }}
        >
          <Box>
            <Button>One</Button>
            <Button>Two</Button>
          </Box>
          <Box>
            <Button>Three</Button>
          </Box>
          <Box>something one</Box>
          <Box>something two</Box>
        </Box>
      </Box>
    </>
  );
}

export default DemoFlexAlignment;

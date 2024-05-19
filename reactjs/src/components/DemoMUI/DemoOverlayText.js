// 3rd-party
import LinkIcon from "@mui/icons-material/Link";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import { Box, Button, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";

// Ours
import PingyaoPhoto from "../../images/Pingyao-Shanxi-China.jpg";

const useStyles = makeStyles({
  picCotnainer: {
    position: "relative",
  },
  picInfo: {
    display: "flex",
    alignItems: "center",
    margin: 5,
  },
  picInfoContainer: {
    display: "flex",
    justifyContent: "left",
  },
  overlayText: {
    position: "absolute",
    top: "10px",
    right: "10px",
    color: "yellow",
  },
});

function DemoOverlayText() {
  const classes = useStyles();
  const [count, setCount] = useState(null);

  const handleClick = (event) => {
    setCount(3);
  };

  // The trick to implement the countdown is to use an Effect that's called
  // every time the component is rendered, and set a timer that's trigger after
  // every second to update the component to trigger the next rendering.
  useEffect(() => {
    if (!count) {
      return;
    }

    setTimeout(() => {
      console.log(`hello: ${count}`);
      setCount(count - 1);
    }, 1000);
  });

  return (
    <>
      <h1>Demo overlay text</h1>
      <Box className={classes.picCotnainer}>
        <img
          src={PingyaoPhoto}
          alt={"Pingyao Ancient City"}
          style={{ maxWidth: "100%", maxHeight: "100%" }}
        />
        {count ? (
          <Typography className={classes.overlayText} variant="h3">
            <span>
              Countdown
              <br />
              {`${count}`}
            </span>
          </Typography>
        ) : null}
      </Box>
      <Box
        style={{
          display: "flex",
          justifyContent: "left",
        }}
      >
        <Box style={{ textAlign: "left" }}>
          <Box className={classes.picInfo}>
            <LocationOnIcon />
            <a href="https://maps.app.goo.gl/f9ahT6JeWiucZ5Ky7">
              Pingyao, Jinzhong, Shanxi, China
            </a>
          </Box>
          <Box className={classes.picInfo}>
            <PersonIcon />
            <a href="https://unsplash.com/@peterburdon">Peter Burdon</a>
          </Box>
          <Box className={classes.picInfo}>
            <LinkIcon />
            <a href="https://unsplash.com/photos/brown-and-red-chinese-lanterns-UT0KQggq1AY">
              Unsplash
            </a>
          </Box>
        </Box>
      </Box>
      <Box style={{ margin: 10 }} />
      <Box>
        <Button
          variant="outlined"
          onClick={handleClick}
          disabled={Boolean(count)}
        >
          Count down
        </Button>
      </Box>
    </>
  );
}

export default DemoOverlayText;

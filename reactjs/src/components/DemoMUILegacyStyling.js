// 3rd-party
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { makeStyles, styled, withStyles } from "@mui/styles";
import React from "react";

const ROOT_STYLES = {
  background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
  border: 0,
  borderRadius: 3,
  boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  color: "white",
  height: 48,
  padding: "0 30px",
};

// `makeStyles(styles, [options]) => hook`
// Ref: https://mui.com/system/styles/api/#makestyles-styles-options-hook
// Note the `styles` parameter can be either a function or an object.
//
// `makeStyles` returns a hook that's conventionally named as `useStyles`
// (in order to follow the `useX` hook naming convention). Therefore,
// `useStyles` cannot be used directly as styles; it must be called to return
// the usable styles.
//
// NOTE(ywen): It looks like `makeStyles` must be called outside the function
// components. I used to call `makeStyles` inside `HookStyling` but didn't
// succeed.
const useStyles = makeStyles({
  root: ROOT_STYLES,
});

function HookStyling({ caption, sx }) {
  const classes = useStyles();

  return (
    <Button className={classes.root} sx={sx}>
      {caption}
    </Button>
  );
}

function StyledComponentsAPIStyling({ caption, sx }) {
  // `styled(Component)(styles, [options]) => Component`
  // Ref: https://mui.com/system/styles/api/#styled-component-styles-options-component
  // Note the `styles` parameter can be either a function or an object.
  const MyStyledButton = styled(Button)(ROOT_STYLES);

  return <MyStyledButton sx={sx}>{caption}</MyStyledButton>;
}

function HigherOrderComponentStyling({ caption, sx }) {
  // The unstyled component is the lower order component.
  function _MyComponent(props) {
    // NOTE(ywen): `withStyles` will pass `classes` as part of `props` that the
    // unstyled component can use.
    const { classes, sx } = props;
    return (
      <Button className={classes.root} sx={sx}>
        Styled (HOC API)
      </Button>
    );
  }

  // `withStyles(styles, [options]) => Component`
  // Ref: https://mui.com/system/styles/api/#withstyles-styles-options-higher-order-component
  // Note the `styles` parameter can be either a function or an object.
  const MyComponent = withStyles({
    root: ROOT_STYLES,
  })(_MyComponent);

  return <MyComponent sx={sx}>{caption}</MyComponent>;
}

function DemoMUILegacyStyling() {
  const gridStyle = {
    border: "2px solid grey",
    paddingTop: 2.5,
    paddingBottom: 2.5,
  };
  const boxStyle = {
    paddingTop: 1,
    paddingBottom: 1,
  };

  return (
    <>
      <h1>MUI legacy styling solutions</h1>
      <Grid container>
        <Grid item xs={4} sx={gridStyle}>
          <h2>Using hook</h2>
          <Box sx={boxStyle}>
            <Button>Original (Default styles)</Button>
          </Box>
          <Box sx={boxStyle}>
            <HookStyling caption="Styled (Hook)" />
          </Box>
        </Grid>
        <Grid item xs={4} sx={gridStyle}>
          <h2>Using styled-components API</h2>
          <Box sx={boxStyle}>
            <Button>Original (Default styles)</Button>
          </Box>
          <Box sx={boxStyle}>
            <StyledComponentsAPIStyling caption="Styled (styled-components API)" />
          </Box>
        </Grid>
        <Grid item xs={4} sx={gridStyle}>
          <h2>Using HOC API</h2>
          <Box sx={boxStyle}>
            <Button>Original (Default styles)</Button>
          </Box>
          <Box sx={boxStyle}>
            <HigherOrderComponentStyling caption="Styled (HOC API)" />
          </Box>
        </Grid>
        <Grid container>
          <Grid item xs={4} sx={gridStyle}>
            <h2>Overridden by `sx`</h2>
            <Box sx={boxStyle}>
              <HookStyling caption="Original" />
            </Box>
            <Box sx={boxStyle}>
              <HookStyling caption="Overridden" sx={{ width: 200 }} />
            </Box>
          </Grid>
          <Grid item xs={4} sx={gridStyle}>
            <h2>Overridden by `sx`</h2>
            <Box sx={boxStyle}>
              <StyledComponentsAPIStyling caption="Original" />
            </Box>
            <Box sx={boxStyle}>
              <StyledComponentsAPIStyling
                caption="Overridden"
                sx={{
                  background:
                    "linear-gradient(45deg, #FFBB88 30%, #FFEE55 90%)",
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={4} sx={gridStyle}>
            <h2>Overridden by `sx`</h2>
            <Box sx={boxStyle}>
              <HigherOrderComponentStyling caption="Original" />
            </Box>
            <Box sx={boxStyle}>
              <HigherOrderComponentStyling
                caption="Overridden"
                sx={{
                  borderRadius: 10,
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default DemoMUILegacyStyling;

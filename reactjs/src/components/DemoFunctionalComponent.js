// 3rd-party
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import React, { useState } from 'react'

/**
 * All about hooks:
 * - Functions starting with `use` are called Hooks.
 * - You can only call Hooks at the top of your components (or other Hooks).
 *   - If you want to use useState in a condition or a loop, extract a new
 *     component and put it there.
 */

function MySeparateCountingButton() {
  // `useState`:
  // Args:
  //   - The variable's initial value.
  // Returns:
  //   - The variable.
  //   - The variable's setter function.
  const [count, setCount] = useState(0)

  // You can define an event handler function inside your components.
  function handleClick() {
    setCount(count + 1)
  }

  return (
    <Button
      variant="contained"
      size="large"
      onClick={handleClick}
      style={{textTransform: 'lowercase'}}
    >
      Click me ({count} time(s) so far)
    </Button>
  )
}

function GridSeparateCountingButtons() {
  return (
    <>
      <p>Buttons that count separately</p>
      <div><MySeparateCountingButton /></div>
      <div><MySeparateCountingButton /></div>
    </>
  )
}

function MySharedCountingButton({count, onClick}) {
  return (
    <Button
      variant="contained"
      size="large"
      onClick={onClick}
      style={{textTransform: 'lowercase'}}
    >
      Click me ({count} time(s) so far)
    </Button>
  )
}

function GridSharedCountingButtons() {
  const [count, setCount] = useState(0)

  function handleClick() {
    setCount(count + 1)
  }

  return (
    <>
      <p>Buttons that shared the counter</p>
      <div><MySharedCountingButton count={count} onClick={handleClick} /></div>
      <div><MySharedCountingButton count={count} onClick={handleClick} /></div>
    </>
  )
}

function DemoFunctionalComponent() {
  return (
    <>
      <h1>Demo of functional components</h1>
      <p>All the components on this page are implemented as functions instead of classes.</p>
      <h3>But the more powerful part is the use of React.js hooks.</h3>
      <h3>Main reference: <a href="https://react.dev/learn" target="_blank" rel="noreferrer">react.dev/learn</a></h3>
      <Grid container spacing={2} sx={{border: '2px solid grey', paddingTop: 2.5, paddingBottom: 2.5}}>
        <Grid item xs={6} sx={{border: '2px solid grey', paddingBottom: 2.5}}>
          {GridSeparateCountingButtons()}
        </Grid>
        <Grid item xs={6} sx={{border: '2px solid grey', paddingBottom: 2.5}}>
          {GridSharedCountingButtons()}
        </Grid>
      </Grid>
    </>
  )
}

export default DemoFunctionalComponent

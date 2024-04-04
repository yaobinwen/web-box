// 3rd-party
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import React from 'react'

// Ours
import Cross from '../images/cross.svg'
import Fireworks from '../images/fireworks.svg'
import OverlaidIcon from './OverlaidIcon'


class DemoOverlaidIcon extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      control: "allow",
      description: null,
    }
  }

  onClickFireworks = () => {
    this.setState({
      description: (
        this.state.control === "allow" ?
          "Yay! Fireworks!!!"
        :
          "Oh no... No fireworks allowed :-("
      )
    })
  }

  onChangeFireworksControl = (event) => {
    this.setState({
      control: event.target.value,
      description: null,
    })
  }

  getFireworksButtonIcon = (width, height) => {
    return (
      this.state.control === "allow" ?
        <Icon style={{ position: "relative", width: width, height: height }}>
          <img
            src={Fireworks}
            alt={"fireworks"}
            width={width}
            height={height}
          />
        </Icon>
      :
        <OverlaidIcon
          iconLabel="no-fireworks"
          width={width}
          height={height}
          baseImage={Fireworks}
          baseImageAlt="fireworks"
          overlayImage={Cross}
          overlayImageAlt="cross"
        />
    )
  }

  render = () => {
    return (
      <Grid container spacing={2} sx={{paddingTop: 2.5, paddingBottom: 2.5}}>
        <Grid item xs={12}>
          <IconButton
            style={{ maxWidth: 200, maxHeight: 200 }}
            color={'inherit'}
            onClick={this.onClickFireworks}
          >
            {this.getFireworksButtonIcon(180, 160)}
          </IconButton>
        </Grid>
        <Grid item xs={12}>
          <FormControl>
            <RadioGroup
              name="radio-group-fireworks-control"
              defaultValue="allow"
              onChange={this.onChangeFireworksControl}
            >
              <FormControlLabel
                value="allow" control={<Radio />} label="Allow fireworks"
              />
              <FormControlLabel
                value="disallow" control={<Radio />} label="Disallow fireworks"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <p>
            {this.state.description ?? null}
          </p>
        </Grid>
        <Grid item xs={12}>
          <p>
            (See "code/src/images/Licenses.md" for the license of the icons.)
          </p>
        </Grid>
      </Grid>
    )
  }
}

export default DemoOverlaidIcon

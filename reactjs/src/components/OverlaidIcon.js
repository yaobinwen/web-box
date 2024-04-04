// 3rd-party
import Icon from '@mui/material/Icon'
import React from 'react'


class OverlaidIcon extends React.Component {
  render = () => {
    const width = this.props.width
    const height = this.props.height

    return (
      <Icon
        style={{ position: "relative", width: width, height: height }}
        aria-label={this.props.iconLabel}
        color={'inherit'}
      >
        <img
          style={{ position: "absolute", top: 0, left: 0 }}
          src={this.props.baseImage}
          alt={this.props.baseImageAlt}
          width={width}
          height={height}
        />
        <img
          style={{ position: "absolute", top: 0, left: 0 }}
          src={this.props.overlayImage}
          alt={this.props.overlayImageAlt}
          width={width}
          height={height}
        />
      </Icon>
    )
  }
}

export default OverlaidIcon

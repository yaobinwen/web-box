// 3rd-party
import FileUploadIcon from '@mui/icons-material/FileUpload'
import { Button } from '@mui/material'
import React from 'react'


class LocalFileLoader extends React.Component {
  constructor(props) {
    super(props)

    this.mounted = false
  }

  componentDidMount = () => {
    this.mounted = true
  }

  componentWillUnmount = () => {
    this.mounted = false
  }

  setStateIfMounted = (newState) => {
    if (this.mounted) {
      this.setState(newState)
    }
  }

  handleFileChange = (event) => {
    console.log(event)
    const files = event.target.files
    console.assert(files.length === 1)
    const file = files[0]
    this.props.onLoaded(file)
  }

  renderUploadButton = () => {
    return (
      <Button
        variant="contained"
        component="label"
        endIcon={<FileUploadIcon />}
      >
        {this.props.caption}
        <input
          type="file"
          accept={this.props.mime_types}
          hidden
          onChange={this.handleFileChange}
        />
      </Button>
    )
  }

  render = () => {
    return (
      <div>
        {this.renderUploadButton()}
      </div>
    )
  }
}

export default LocalFileLoader

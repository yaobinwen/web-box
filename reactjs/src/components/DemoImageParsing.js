// 3rd-party
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import React from 'react'

// Ours
import LocalFileLoader from './LocalFileLoader'
import * as JPEG from '../modules/ImageFormatJPEG'
import * as PNG from '../modules/ImageFormatPNG'


class DemoImageParsing extends React.Component {
  constructor(props) {
    super(props)

    this.mounted = false

    this.state = {
      image_file: null,
      height: null,
      width: null,
      data_url: null,
    }
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

  onFileLoaded = async (file) => {
    this.setStateIfMounted({
      image_file: file,
    })

    let fileBuffer = await file.arrayBuffer()

    let image_dim = null

    if (file.type === PNG.MIME_TYPE_PNG) {
      image_dim = PNG.verifyPNGSignature(fileBuffer)
    } else if (file.type === JPEG.MIME_TYPE_JPEG) {
      JPEG.verifyJPEGImageSignature(fileBuffer)
      image_dim = JPEG.retrieveJPEGImageDimension(fileBuffer)
    } else {
      throw new Error(`Unrecognized mime type "${file.type}"`)
    }

    this.setStateIfMounted(image_dim)

    window.URL.revokeObjectURL(this.state.data_url)
    this.setStateIfMounted({
      data_url: window.URL.createObjectURL(file),
    })
  }

  renderImageInfo = () => {
    const f = this.state.image_file

    if (!f) {
      return <div></div>
    }

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">File Name</TableCell>
              <TableCell align="center">Mime Type</TableCell>
              <TableCell align="center">Size (Bytes)</TableCell>
              <TableCell align="center">Height (Pixel)</TableCell>
              <TableCell align="center">Width (Pixel)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow key={f.name}>
              <TableCell align="center">
                {f.name}
              </TableCell>
              <TableCell align="center">{f.type}</TableCell>
              <TableCell align="center">{f.size}</TableCell>
              <TableCell align="center">{this.state.height}</TableCell>
              <TableCell align="center">{this.state.width}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  renderImage = () => {
    if (!this.state.data_url) {
      return <div></div>
    }

    return (
      <img
        src={this.state.data_url}
        crossOrigin={"anonymous"}
        alt=''
        width={window.innerWidth * 0.5}
        height={window.innerHeight * 0.5}
      />
    )
  }

  render = () => {
    return (
      <Grid container spacing={2} sx={{paddingTop: 2.5, paddingBottom: 2.5}}>
        <Grid item xs={2}></Grid>
        <Grid item xs={8}>
          <LocalFileLoader
            caption={"Upload an Image (PNG/JPEG)"}
            mime_types={"image/jpeg,image/png"}
            onLoaded={this.onFileLoaded}
          />
        </Grid>
        <Grid item xs={2}></Grid>

        <Grid item xs={2}></Grid>
        <Grid item xs={8}>
          {this.renderImageInfo()}
        </Grid>
        <Grid item xs={2}></Grid>

        <Grid item xs={12}>
          {this.renderImage()}
        </Grid>
      </Grid>
    )
  }
}

export default DemoImageParsing

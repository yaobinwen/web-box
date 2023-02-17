// 3rd-party
import { Button } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import axios from 'axios'
import React from 'react'

// Ours
import * as JPEG from '../modules/ImageFormatJPEG'
import * as Perf from '../modules/Performance'

const RATIO = 1920 / 1200
const MINWIDTH = 1200
const MINHEIGHT = MINWIDTH / RATIO

const SNAPSHOT_TIMEOUT_MS = 1000 * 60  // 60 seconds


class DemoWVSSnapshot extends React.Component {
  constructor(props) {
    super(props)

    this.mounted = false

    this.state = {
      wvs_snapshot_uri: null,

      status: null,

      image_natural_height: null,
      image_natural_width: null,

      image_area_height: 0,
      image_area_width: 0,

      image_data_url: null,
      image_data: null,

      image_data_url_png: null,
      image_data_png: null,
    }
  }

  componentDidMount = () => {
    this.mounted = true

    // Initial window resizing.
    this.onWindowResize();
    window.addEventListener("resize", this.onWindowResize);

    // Handle the mouse movement.
    window.addEventListener("mousemove", this.onMouseMove);
  }

  componentWillUnmount = () => {
    this.mounted = false

    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('mousemove', this.onMouseMove);
  }

  setStateIfMounted = (newState) => {
    if (this.mounted) {
      this.setState(newState)
    }
  }

  onWindowResize = () => {
    let width = window.innerWidth - 200
    let height = window.innerHeight - 200

    width = Math.max(width, MINWIDTH)
    height = Math.max(height, MINHEIGHT)

    this.setState({
      image_area_height: height,
      image_area_width: width,
    });
  }

  onMouseMove = (event) => {
    event.preventDefault();
  }

  getImageDataBase64_as_Promise = (blob) => {
    return new Promise((resolve, reject) => {
      let fr = new FileReader()
      fr.onload = (event) => resolve(event.target.result)
      fr.onerror = (event) => reject(
        "Failed to load image: " + event.target.error
      )

      fr.readAsDataURL(blob)
    })
  }

  getImage_as_Promise = (imageDataURLBase64) => {
    return new Promise((resolve, reject) => {
      let i = new Image()
      i.onload = (event) => {
        resolve(event.target)
      }
      i.onerror = (event) => reject(
        "Failed to load image data (base64): " + event
      )
      i.src = imageDataURLBase64
    })
  }

  computeScaledSize = (maxWidth, maxHeight, givenWidth, givenHeight) => {
    console.assert(
      maxWidth > 0 && maxHeight > 0 && givenWidth > 0 && givenHeight > 0,
      'All dimensions must be positive to compute scaled size.'+
      ' Given parameters: %o',
      {
        maxWidth: maxWidth,
        maxHeight: maxHeight,
        givenWidth: givenWidth,
        givenHeight: givenHeight
      }
    );

    let maxAspect = maxWidth / maxHeight
    let givenAspect = givenWidth / givenHeight
    let scaledHeight = null
    let scaledWidth = null

    if (maxAspect > givenAspect) {
      // fill available height, center horizontally
      scaledHeight = maxHeight;
      scaledWidth = scaledHeight * givenAspect;
    } else {
      // fill available width, center vertically
      scaledWidth = maxWidth;
      scaledHeight = scaledWidth / givenAspect;
    }

    // This step of this method of calculating the scaled image size is OK for
    // displaying an image, but because we are going to use the displayed
    // image to calculate pixels in the original image, this introduces error
    // into that calculation.  The aspect ratio of the scaled image is
    // slightly different than the aspect ratio of the original image.  It's a
    // very small difference not likely to be noticeable ever, but it is
    // technically incorrect.  The right solution is to find the common
    // divisors of givenWidth and givenHeight and scale givenWidth and
    // givenHeight by the smallest common divisor such that scaledWidth <
    // maxWidth and scaledHeight < maxHeight.  This preserves the precise
    // aspect ratio, with no rounding errors.
    //
    // Alternatively, this approach might be right as long as the coordinates
    // we might get from the resized image are scaled back up using the
    // actual ratio obtained after doing this rounding.  That is, the pixel
    // coordinates have to be scaled differently in each dimension.
    let scaledSize = {
      width: Math.round(scaledWidth),
      height: Math.round(scaledHeight),
    };

    return scaledSize;
  }

  fetchSnapshot_1 = async (uri) => {
    let config = {
      responseType: "blob",
      timeout: SNAPSHOT_TIMEOUT_MS,
    }

    return axios.get(uri, config)
      .then(response => {
        Perf.mark("mark_fetch_snapshot_end")
        Perf.duration(
          "Fetch snapshot (start)", "mark_fetch_snapshot_start",
          "Fetch snapshot (end)", "mark_fetch_snapshot_end",
        )

        Perf.mark("mark_create_obj_url_start")
        return this.getImageDataBase64_as_Promise(response.data)
      })
      .then(imageDataURLBase64 => {
        Perf.mark("mark_create_obj_url_end")
        Perf.duration(
          "Create obj URL (start)", "mark_create_obj_url_start",
          "Create obj URL (end)", "mark_create_obj_url_end",
        )

        Perf.mark("mark_get_image_start")
        return this.getImage_as_Promise(imageDataURLBase64)
      })
      .then(image => {
        Perf.mark("mark_get_image_end")
        Perf.duration(
          "Get image (start)", "mark_get_image_start",
          "Get image (end)", "mark_get_image_end",
        )
        Perf.duration(
          "Fetch snapshot (start)", "mark_fetch_snapshot_start",
          "Get image (end)", "mark_get_image_end",
        )

        let pos = image.src.indexOf(",")
        this.setStateIfMounted({
          image_natural_height: image.naturalHeight,
          image_natural_width: image.naturalWidth,
          image_data_url: image.src,
          image_data: image.src.substring(pos+1),
        })

        return image
      })
      .then(image => {
        setTimeout(() => {
          Perf.mark("mark_jpg_to_png_start")
          let canvas = document.createElement("canvas")
          canvas.height = image.naturalHeight
          canvas.width = image.naturalWidth
          canvas.getContext("2d").drawImage(image, 0, 0)
          let imageDataURLBase64_png = canvas.toDataURL("image/png")

          Perf.mark("mark_jpg_to_png_end")
          Perf.duration(
            "JPG to PNG (start)", "mark_jpg_to_png_start",
            "JPG to PNG (end)", "mark_jpg_to_png_end",
          )

          let pos = imageDataURLBase64_png.indexOf(",")
          this.setStateIfMounted({
            image_data_url_png: imageDataURLBase64_png,
            image_data_png: imageDataURLBase64_png.substring(pos+1),
          })
        }, 0)
      })
  }

  fetchSnapshot_2 = async (uri) => {
    if (this.state.image_data_url) {
      window.URL.revokeObjectURL(this.state.image_data_url)
    }

    let config = {
      responseType: "blob",
      timeout: SNAPSHOT_TIMEOUT_MS,
    }

    return axios.get(uri, config)
      .then(response => {
        Perf.mark("mark_fetch_snapshot_end")
        Perf.duration(
          "Fetch snapshot (start)", "mark_fetch_snapshot_start",
          "Fetch snapshot (end)", "mark_fetch_snapshot_end",
        )

        let image_data_url = window.URL.createObjectURL(response.data)
        let pos = image_data_url.indexOf(",")
        let image_data = image_data_url.substring(pos+1)

        this.setStateIfMounted({
          image_data_url: image_data_url,
          image_data: image_data,
        })
        return response.data.arrayBuffer()
      })
      .then(arrayBuffer => {
        JPEG.verifyJPEGImageSignature(arrayBuffer)
        let {height, width} = JPEG.retrieveJPEGImageDimension(arrayBuffer)
        this.setStateIfMounted({
          image_natural_height: height,
          image_natural_width: width,
        })
      })
  }

  onWVSSnapshotURIChange = (event) => {
    let value = event.target.value

    this.setStateIfMounted({
      wvs_snapshot_uri: value,
    })
  }

  onClickFetch = () => {
    Perf.mark("mark_fetch_snapshot_start")

    this.setStateIfMounted({
      status: "Fetching..."
    })

    this.fetchSnapshot_2(this.state.wvs_snapshot_uri)
      .then(() => {
        Perf.mark("mark_done")
        Perf.duration(
          "Fetch snapshot (start)", "mark_fetch_snapshot_start",
          "Done", "mark_done",
        )

        this.setState({
          status: "Snapshot fetched",
        })
      })
      .catch(error => {
        this.setStateIfMounted({
          status: "Failed to load snapshot: " + error.message,
        })
      })
  }

  getInputBar = () => {
    return (
      <div>
        <TextField
          label="WVS snapshot URI"
          variant="outlined"
          helperText="Example: http://<wvs-address>/snapshot?topic=<topic>&quality=90"
          type="url"
          onChange={this.onWVSSnapshotURIChange}
          fullWidth
        />
      </div>
    )
  }

  getFetchButton = () => {
    return (
      <Button
        variant="contained"
        size="large"
        endIcon={<DownloadIcon />}
        onClick={this.onClickFetch}
      >
        Fetch
      </Button>
    )
  }

  getElemStatus = () => {
    return (
      this.state.status === null ?
        <div></div>
      :
        <p>
          Status: {this.state.status}
        </p>
    )
  }

  getElemImage = () => {
    let image_is_available = (
      this.state.image_data_url !== null &&
      this.state.image_natural_height !== null &&
      this.state.image_natural_width !== null
    )

    if (!image_is_available) {
      return null
    }

    let displayDimension = this.computeScaledSize(
      this.state.image_area_width,
      this.state.image_area_height,
      this.state.image_natural_width,
      this.state.image_natural_height,
    )

    return (
      <img
        id={'img'}
        crossOrigin={"anonymous"}
        src={this.state.image_data_url}
        width={displayDimension.width}
        height={displayDimension.height}
        alt='Snapshot'
      />
    )
  }

  render = () => {
    Perf.mark("mark_render")

    return (
      <Grid container spacing={2} sx={{paddingTop: 2.5, paddingBottom: 2.5}}>
        <Grid item xs={2}></Grid>
        <Grid item xs={8}>
          {this.getInputBar()}
        </Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={12}>
          {this.getFetchButton()}
        </Grid>
        <Grid item xs={12}>
          {this.getElemStatus()}
        </Grid>
        <Grid item xs={12}>
          {this.getElemImage()}
        </Grid>
      </Grid>
    )
  }
}

export default DemoWVSSnapshot

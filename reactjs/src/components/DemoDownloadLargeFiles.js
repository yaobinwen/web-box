// 3rd-party
import Grid from '@mui/material/Grid'
import React from 'react'

// Ours
import URLInput from './URLInput'
import { RangeDownloadManager } from '../modules/DownloadManager'


class DemoDownloadLargeFiles extends React.Component {
  constructor(props) {
    super(props)

    this.mounted = false

    this.state = {
      file_uri: null,
      fetch_method: null,
      progress: null,
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

  onURLChange = (event) => {
    let value = event.target.value

    this.setStateIfMounted({
      file_uri: value,
    })
  }

  // NOTE(ywen): This works, but the fetching progress is not visible to the
  // caller so we can't update the progress to the user. Therefore, direct
  // fetch is suitable when the target resource is small enough to be fetched
  // almost instantly so the users don't sense any obvious delay.
  onButtonClick_fetch_directly = () => {
    this.setStateIfMounted({
      fetch_method: "Fetch directly (not as a stream)",
    })

    const url = this.state.file_uri

    fetch(url)
      .then(response => {
        return response.blob()
      })
      .then(blob => {
        return URL.createObjectURL(blob)
      })
      .then(download_url => {
        const link = document.createElement('a')
        link.href = download_url
        link.download = "target.zip"
        link.click()
      })
      .catch(reason => {
        console.error(reason)
      })
  }

  // NOTE(ywen): Fetching as a stream can give the user progress information.
  onButtonClick_fetch_stream = () => {
    this.setStateIfMounted({
      fetch_method: "Fetch as a stream",
    })

    const url = this.state.file_uri

    let _this = this
    let contentLength = null
    let downloaded = 0
    let percentage = 0
    fetch(url)
      .then(response => {
        contentLength = response.headers.get('Content-Length')
        return response
      })
      .then(response => {
        const reader = response.body.getReader()

        return new ReadableStream({
          async start(controller) {
            while (true) {
              const { done, value } = await reader.read()

              // When `done` is true, `value` may be `null`.
              if (value) {
                downloaded += value.byteLength
                if (contentLength) {
                  percentage = (downloaded / contentLength * 100).toFixed(2)
                  _this.setStateIfMounted({
                    progress: `${percentage}%`
                  })
                } else {
                  _this.setStateIfMounted({
                    progress: `${downloaded} bytes downloaded (total unknown)`
                  })
                }
              }

              // When no more data needs to be consumed, break the reading
              if (done) {
                break
              }

              // Enqueue the next data chunk into our target stream
              controller.enqueue(value)
            }

            // Close the stream
            controller.close()
            reader.releaseLock()
          }
        })
      })
      .then(rs => {
        return new Response(rs)
      })
      .then(response => {
        return response.blob()
      })
      .then(blob => {
        return URL.createObjectURL(blob)
      })
      .then(download_url => {
        const link = document.createElement('a')
        link.href = download_url
        link.download = "target.zip"
        link.click()
      })
      .catch(reason => {
        console.error(reason)
      })
  }

  // NOTE(ywen): Fetching using ranges is suitable when the content length of
  // the target resource is known.
  onButtonClick_fetch_ranges = () => {
    this.setStateIfMounted({
      fetch_method: "Fetch using ranges",
    })

    const url = this.state.file_uri
    const options = {
      fileName: 'target.zip'
    }

    const manager = new RangeDownloadManager(url, options)

    manager.on(
      'onProgress', (downloadedSize, totalSize) => {
        const percentage = (downloadedSize / totalSize * 100).toFixed(2)
        this.setStateIfMounted({
          progress: `${percentage}%`,
        })
      }
    )

    manager.start()
  }

  getFetchMethod = () => {
    let method = (this.state.fetch_method ?? "<Unknown>")
    return <p>Fetch method: {method}</p>
  }

  getDownloadProgress = () => {
    let progressDescription = (
      this.state.progress ? `${this.state.progress}` : "N/A"
    )
    return (
        <p>
          Progress: {progressDescription}
        </p>
    )
  }

  render = () => {
    return (
      <Grid container spacing={2} sx={{paddingTop: 2.5, paddingBottom: 2.5}}>
        <Grid item xs={12}>
          <URLInput
            label="File URL"
            helperText="Example: https://example.com/filename.txt"
            buttonCaption="Download"
            onURLChange={this.onURLChange}
            onButtonClick={this.onButtonClick_fetch_ranges}
          />
        </Grid>
        <Grid item xs={12}>
          {this.getFetchMethod()}
        </Grid>
        <Grid item xs={12}>
          {this.getDownloadProgress()}
        </Grid>
      </Grid>
    )
  }
}

export default DemoDownloadLargeFiles

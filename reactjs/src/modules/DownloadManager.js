class RangeDownloadManager {
  constructor(url, options) {
    this.url = url
    this.options = options
    this.chunkSize = 1024 * 1024 // 1 MB
    this.chunkStart = 0
    this.totalSize = 0
    this.downloadedSize = 0
    this.isPaused = false
    this.callbacks = {
      onProgress: null,
      onComplete: null,
      onPause: null,
      onResume: null,
      onError: null,
    }
  }

  start() {
    this.isPaused = false
    this.download()
  }

  pause() {
    this.isPaused = true
    if (this.callbacks.onPause) {
      this.callbacks.onPause()
    }
  }

  resume() {
    this.isPaused = false
    if (this.callbacks.onResume) {
      this.callbacks.onResume()
    }
    this.download()
  }

  on(event, callback) {
    this.callbacks[event] = callback
  }

  async fetchObjectHead() {
    const response = await fetch(this.url, { method: 'HEAD' })
    if (!response.ok) {
      if (this.callbacks.onError) {
        this.callbacks.onError(response.statusText)
      }
      return
    }

    return response
  }

  async fetchObject() {
    const chunkEnd = this.chunkStart + this.chunkSize - 1
    const headers = {
      Range: `bytes=${this.chunkStart}-${chunkEnd}`,
    }
    const response = await fetch(this.url, { headers })

    if (!response.ok) {
      if (this.callbacks.onError) {
        this.callbacks.onError(response.statusText)
      }
      return
    }

    return response
  }

  async processChunk(response, dataView) {
    const reader = response.body.getReader()
    let j = this.chunkStart
    while (true) {
      if (this.isPaused) {
        reader.cancel()
        if (this.callbacks.onPause) {
          this.callbacks.onPause()
        }
        break
      }

      const { done, value } = await reader.read()
      if (done) {
        if (this.callbacks.onComplete) {
          this.callbacks.onComplete()
        }
        break
      }

      this.downloadedSize += value.byteLength
      if (this.callbacks.onProgress) {
        this.callbacks.onProgress(this.downloadedSize, this.totalSize)
      }

      for (let i = 0; i < value.byteLength; ++i) {
        dataView.setUint8(j + i, value.at(i))
      }

      j += value.byteLength
    }

    this.chunkStart += this.chunkSize
  }

  async download() {
    let response = await this.fetchObjectHead()

    const contentLength = response.headers.get('Content-Length')
    if (!this.totalSize) {
      this.totalSize = parseInt(contentLength)
    }

    let objectBuffer = new ArrayBuffer(this.totalSize)
    let dataView = new DataView(objectBuffer)

    while (this.downloadedSize < this.totalSize) {
      response = await this.fetchObject()
      await this.processChunk(response, dataView)
    }

    const blob = new Blob([objectBuffer], { type: response.headers.get('Content-Type') })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = this.options.fileName
    link.click()
  }
}

export {
  RangeDownloadManager,
}

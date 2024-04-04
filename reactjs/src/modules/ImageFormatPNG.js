const MIME_TYPE_PNG = "image/png"

function verifyPNGSignature(arrayBuffer) {
  let dv = new DataView(arrayBuffer.slice(0, 48))

  let hdr = dv.getBigUint64(0)
  if (hdr !== 9894494448401390090n) {
    // This image does not match the PNG signature
    // \x89 50 4E 47 0D 0A 1A 0A
    throw new Error(`Image is not in PNG format`)
  }

  let width = dv.getUint32(16) // Get width from IHDR chunk
  let height = dv.getUint32(20) // Get height from IHDR chunk

  return {
    "height": height,
    "width": width,
  }
}

export {
  MIME_TYPE_PNG,
  verifyPNGSignature,
}

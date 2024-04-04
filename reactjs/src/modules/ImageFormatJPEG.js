const MIME_TYPE_JPEG = "image/jpeg"

const MARKER_STARTING_BYTE = 0xFF
const MARKER_SOI = 0xFFD8
const MARKER_EOI = 0xFFD9

const MARKER_CODE_SOFn = "SOFn"
const MARKER_CODE_JPG = "JPG"
const MARKER_CODE_DHT = "DHT"
const MARKER_CODE_DAC = "DAC"
const MARKER_CODE_RSTm = "RSTm"
const MARKER_CODE_SOI = "SOI"
const MARKER_CODE_EOI = "EOI"
const MARKER_CODE_SOS = "SOS"
const MARKER_CODE_DQT = "DQT"
const MARKER_CODE_DNL = "DNL"
const MARKER_CODE_DRI = "DRI"
const MARKER_CODE_DHP = "DHP"
const MARKER_CODE_EXP = "EXP"
const MARKER_CODE_APPn = "APPn"
const MARKER_CODE_JPGn = "JPGn"
const MARKER_CODE_COM = "COM"
const MARKER_CODE_TEM = "TEM"
const MARKER_CODE_RES = "RES"

function getMarkerCode(byte) {
  if ((0xC0 <= byte && byte <= 0xC3) || (0xC5 <= byte && byte <= 0xC7) ||
      (0xC9 <= byte && byte <= 0xCB) || (0xCD <= byte && byte <= 0xCF)) {
    return MARKER_CODE_SOFn
  } else if (0xC4 === byte) {
    return MARKER_CODE_DHT
  } else if (0xC8 === byte) {
    return MARKER_CODE_JPG
  } else if (0xCC === byte) {
    return MARKER_CODE_DAC
  } else if (0xD0 <= byte && byte <= 0xD7) {
    return MARKER_CODE_RSTm
  } else if (0xD8 === byte) {
    return MARKER_CODE_SOI
  } else if (0xD9 === byte) {
    return MARKER_CODE_EOI
  } else if (0xDA === byte) {
    return MARKER_CODE_SOS
  } else if (0xDB === byte) {
    return MARKER_CODE_DQT
  } else if (0xDC === byte) {
    return MARKER_CODE_DNL
  } else if (0xDD === byte) {
    return MARKER_CODE_DRI
  } else if (0xDE === byte) {
    return MARKER_CODE_DHP
  } else if (0xDF === byte) {
    return MARKER_CODE_EXP
  } else if (0xE0 <= byte && byte <= 0xEF) {
    return MARKER_CODE_APPn
  } else if (0xF0 <= byte && byte <= 0xFD) {
    return MARKER_CODE_JPGn
  } else if (0xFE === byte) {
    return MARKER_CODE_COM
  } else if (0x01 === byte) {
    return MARKER_CODE_TEM
  } else if (0x02 <= byte && byte <= 0xBF) {
    return MARKER_CODE_RES
  }

  return null
}

function isStandAloneMarker(marker_code) {
  return (
    MARKER_CODE_RSTm === marker_code ||
    MARKER_CODE_SOI === marker_code ||
    MARKER_CODE_EOI === marker_code ||
    MARKER_CODE_TEM === marker_code
  )
}

function verifyJPEGImageSignature(arrayBuffer) {
  let dv = null

  dv = new DataView(arrayBuffer.slice(0, 2))
  const first2bytes = dv.getUint16(0)
  if (first2bytes !== MARKER_SOI) {
    throw new Error("Image is not in JPEG format")
  }

  dv = new DataView(arrayBuffer.slice(-2))
  const last2bytes = dv.getUint16(0)
  if (last2bytes !== MARKER_EOI) {
    throw new Error("Image is not in JPEG format")
  }
}

// Ref: DIGITAL COMPRESSION AND CODING OF CONTINUOUS-TONE STILL IMAGES -
// REQUIREMENTS AND GUIDELINES
// https://www.w3.org/Graphics/JPEG/itu-t81.pdf
function retrieveJPEGImageDimension(arrayBuffer) {
  let width = null
  let height = null

  // The number of frames present. An image without any frame is in the
  // "abbreviated format for table-specification data" and doesn't contain
  // image dimension so we can't handle it.
  let frame_count = 0

  let dv = new DataView(arrayBuffer)

  // Keep examining the bytes until we find the image dimension. Once the
  // dimension is found, we skip the remaining bytes in the image.
  let i = 0
  let curr_byte = null
  let next_byte = null
  while (i < dv.byteLength && !width && !height) {
    curr_byte = dv.getUint8(i++)
    if (MARKER_STARTING_BYTE !== curr_byte) {
      // If this is not the starting byte of a marker, we just move on.
      continue
    }

    // Now this is the starting byte of a marker. Let's see if the next byte
    // indicates a valid marker.
    next_byte = dv.getUint8(i++)
    let marker_code = getMarkerCode(next_byte)
    if (isStandAloneMarker(marker_code)) {
      // If this is a stand alone marker, it is not the start of a marker
      // segment so there won't be any bytes to represent the length of the
      // segment. So we just move on to the next byte (which should be the
      // starting byte of a new marker).
      continue
    }

    switch (marker_code) {
      case MARKER_CODE_DHP:
        // A DHP segment means the image is encoded in the hierarchical mode
        // which results in an image of multiple frames. In this case, we
        // should probably use the dimension stored in DHP segment instead of
        // the dimension in any of the frames, according to the specification.
        // However, I can't find a JPEG image in the hierarchical mode for
        // testing so this function assumes the input image is not in
        // hierarchical mode.
        throw new Error("JPEG images in hierarchical mode are not supported")
      case MARKER_CODE_SOFn:
        frame_count++
        i += 2  // Skip the 2 bytes for "frame header length".
        i += 1  // Skip the byte for "sample precision".
        height = dv.getUint16(i)
        i += 2
        width = dv.getUint16(i)
        i += 2
        break
      case MARKER_CODE_DHT:
        // Fall through
      case MARKER_CODE_DAC:
        // Fall through
      case MARKER_CODE_DQT:
        // Fall through
      case MARKER_CODE_DNL:
        // Fall through
      case MARKER_CODE_DRI:
        // Fall through
      case MARKER_CODE_EXP:
        // Fall through
      case MARKER_CODE_APPn:
        // Fall through
      case MARKER_CODE_COM:
        i += dv.getUint16(i)
        break
      case MARKER_CODE_SOS:
        i += dv.getUint16(i)
        // NOTE(ywen): A scan marker segment is actually followed by one or
        // more entropy-coded segments (ECS). Therefore, to completely deal
        // with a SOS segment, I need to skip the SOS segment and then skip
        // all the ECSs until I reach the next marker. However, I haven't
        // learned how to calculate the ECS length properly, so I will just
        // skip the SOS segment and let the while loop skip the ECSs byte by
        // byte until the next marker.
        break
      case MARKER_CODE_JPG:
        // Fall through
      case MARKER_CODE_JPGn:
        // Fall through
      case MARKER_CODE_RES:
        // We don't know how to parse these segments because the specification
        // doesn't have the definition. So we just move onto the next byte.
        i++
        break
      default:
        // When we are here, we should be in a entropy-coded segment (ECS).
        // Most of the time, the bytes in an ECS are skipped by the
        // condition `(MARKER_STARTING_BYTE !== curr_byte)` at the beginning of
        // this while loop. However, an ECS can contain an `0xFF` byte due to
        // padding, and we will be taken here when this happens. We can simply
        // move onto the next byte.
        i++
        break
    }
  }

  if (frame_count === 0) {
    throw new Error(
      "Image has no frame " +
      "(possibly in the abbreviated format for table-specification data)"
    )
  }

  return {
    "height": height,
    "width": width,
  }
}

export {
  MIME_TYPE_JPEG,
  verifyJPEGImageSignature,
  retrieveJPEGImageDimension,
}

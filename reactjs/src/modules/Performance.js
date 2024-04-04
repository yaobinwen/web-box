const PERF_MSG_TAG = "Performance"
const LOG_COLOR = "background: #333; color: #bada55"

export function mark(perfMark) {
  performance.mark(perfMark)
  console.info(
    `%c [${PERF_MSG_TAG}] MARK '${perfMark}' time: %o`,
    LOG_COLOR,
    Date.now(),
  )
}

export function duration(startDesc, startMark, endDesc, endMark) {
  console.info(
    `%c [${PERF_MSG_TAG}] TOTAL TIME from '${startDesc}' to '${endDesc}': %o`,
    LOG_COLOR,
    performance.measure(
      `Measure time from '${startDesc}' to '${endDesc}'`, startMark, endMark,
    ),
  )
}

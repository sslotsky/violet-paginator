import jelly from './async'
import spill from './logger'

let logging = false

export function debug(shouldDebug = true) {
  logging = shouldDebug
}

export default function getMiddleware() {
  if (logging) {
    return [jelly, spill]
  }

  return [jelly]
}

export default function debounce(asyncAction, ms = 0) {
  let timer = null

  return (...args) => {
    clearTimeout(timer)

    return dispatch => new Promise((resolve) => {
      timer = setTimeout(() => {
        resolve(dispatch(asyncAction(...args)))
      }, ms)
    })
  }
}

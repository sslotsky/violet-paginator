/* eslint-disable no-alert, no-console */

import { stateInfo } from '../lib/stateManagement'

export default store => next => action => {
  const map = stateInfo()
  const state = store.getState()
  const serialized = Object.keys(map).reduce((s, k) => ({
    ...s,
    [k]: map[k].locator(state).toJS()
  }), {})

  const { type, ...rest } = action

  console.log('Dispatching:')
  console.log({ type, payload: rest })
  console.log('State after dispatch:')
  console.log(serialized)

  return next(action)
}


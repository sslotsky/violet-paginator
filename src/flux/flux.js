import connect from './connect'
import { createStore } from './store'

let flux = {
  decorate: connect
}

export function initializeStore(store = createStore()) {
  flux = { ...store, decorate: connect }
}

export function bindActions(actions) {
  return Object.keys(actions).reduce((boundActions, k) => ({
    ...boundActions,
    [k]: (...args) => flux.dispatch(actions[k](...args))
  }), {})
}

export const getFlux = () => flux


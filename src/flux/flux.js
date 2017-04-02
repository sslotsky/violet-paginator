import connect from './connect'
import { createStore } from './store'

const store = createStore()

let flux = {
  dispatch: store.dispatch,
  getState: store.getState,
  subscribe: store.subscribe,
  decorate: connect
}

export function injectFlux(impl) {
  flux = { ...impl, decorate: connect }
}

export function bindActions(actions) {
  return Object.keys(actions).reduce((boundActions, k) => ({
    ...boundActions,
    [k]: (...args) => flux.dispatch(actions[k](...args))
  }), {})
}

export const getFlux = () => flux


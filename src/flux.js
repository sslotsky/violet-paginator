import connect from './containers/Connector'
import { createStore } from './store'

const store = createStore()

let flux = {
  dispatch: store.dispatch,
  getState: store.getState,
  decorate: connect
}

export function bindActions(actions) {
  return Object.keys(actions).reduce((boundActions, k) => ({
    ...boundActions,
    [k]: (...args) => flux.dispatch(actions[k](...args))
  }), {})
}

export function injectStore({
  decorate,
  getState,
  dispatch
}) {
  flux = { decorate, getState, dispatch, bindActions }
}

export const getFlux = () => flux


import createPaginator from '../reducer'
import getMiddleware from '../middleware/internalMiddleware'


const reducers = {}
const state = {}

const getState = () => state

const listeners = []

export function paginate(config) {
  const { locator: _, ...rest } = config
  const reducer = createPaginator(rest)
  reducers[config.listId] = reducer
  state[config.listId] = reducer()
  return reducer
}

let store = null

const dispatch = action => {
  Object.keys(state).forEach(k => {
    state[k] = reducers[k](state[k], action)
  })

  listeners.forEach(l => l())

  return action
}

const compose = (a, b, ...rest) => {
  if (!b) {
    return a(arg => arg)
  }

  return a(compose(b, ...rest))
}

export function createStore() {
  if (!store) {
    store = {
      getState,
      subscribe: listener => {
        listeners.push(listener)

        return function unsubscribe() {
          listeners.splice(listeners.indexOf(listener), 1)
        }
      }
    }

    const chain = getMiddleware().map(m => m(store))

    store.dispatch = action => dispatch(compose(...chain)(action))
  }

  return store
}


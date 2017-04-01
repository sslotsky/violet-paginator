import createPaginator from './reducer'

const reducers = {}
const state = {}

const getState = () => state

const listeners = []

const dispatch = action => {
  if (typeof(action) === 'function') {
    return action(dispatch, getState)
  }

  Object.keys(state).forEach(k => {
    state[k] = reducers[k](state[k], action); 
  })

  listeners.forEach(l => l())
  return action
}

export function paginate(config) {
  const { locator: _, ...rest } = config
  const reducer = createPaginator(rest)
  reducers[config.listId] = reducer
  state[config.listId] = reducer()
  return reducer
}

let store = null

export function createStore() {
  if (!store) {
    store = {
      getState,
      dispatch,
      subscribe: listener => listeners.push(listener),
      unsubscribe: listener => listeners.splice(listeners.indexOf(listener), 1)
    }
  }

  return store
}


export function resolveAll(initialState, register) {
  return function resolve(state = initialState, action = {}, handlers = register(state, action)) {
    return handlers[action.type] ? handlers[action.type]() : state
  }
}

export function resolveEach(initialState, handlers) {
  return function resolve(state = initialState, action = {}) {
    return handlers[action.type] ? handlers[action.type](state, action) : state
  }
}

export function updateListItem(list, id, update, identifier = 'id') {
  return list.map(i => {
    if (i.get(identifier) === id) {
      return update(i)
    }

    return i
  })
}

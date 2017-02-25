import composables from '../actions/simpleComposables'

const cache = {}

export default function updatesCache(listId, dispatch) {
  const cacheSlice = cache[listId] = cache[listId] || {}
  const actions = composables(listId)

  return {
    update: (id, promise) => {
      cacheSlice[id] = cacheSlice[id] || 0
      dispatch(actions.updatingItem(id))
      cacheSlice[id]++

      return promise.then(resp => {
        dispatch(actions.updateComplete(id, --cacheSlice[id]))
        return resp
      }).catch(err => {
        dispatch(actions.updateComplete(id, --cacheSlice[id]))
        throw err
      })
    }
  }
}

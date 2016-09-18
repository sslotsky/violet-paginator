import { Map } from 'immutable'

export default function getPaginator(state, listId) {
  return state.pagination.find(p => p.get('id') === listId, undefined, Map())
}

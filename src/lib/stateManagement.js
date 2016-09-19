import { defaultPaginator } from '../reducer'

export default function getPaginator(state, listId) {
  return state.pagination.find(p => p.get('id') === listId, undefined, defaultPaginator)
}

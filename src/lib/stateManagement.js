import { defaultPaginator } from '../reducer'

export default function getPaginator(state, listId) {
  return state.pagination.find(p => p.get('id') === listId, undefined, defaultPaginator)
}

export function isUpdating(state, listId, itemId) {
  return getPaginator(state, listId)
    .get('updating')
    .includes(itemId)
}

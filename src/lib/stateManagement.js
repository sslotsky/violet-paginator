import { defaultPaginator } from '../reducer'

export default function getPaginator(state, listId) {
  return state.pagination.find(p => p.get('id') === listId, undefined, defaultPaginator)
}

export function isUpdating(state, listId, itemId) {
  const paginator = getPaginator(state, listId)
  return paginator.get('updating').includes(itemId) ||
    paginator.get('bulkUpdating')
}

export function isRemoving(state, listId, itemId) {
  const paginator = getPaginator(state, listId)
  return paginator.get('removing').includes(itemId)
}

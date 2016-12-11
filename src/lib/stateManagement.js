import Immutable from 'immutable'
import { defaultPaginator } from '../reducer'

export default function getPaginator(state, listId) {
  return state.pagination.find(p => p.get('id') === listId, undefined, defaultPaginator)
}

const preload = { results: [] }

export function preloadedPaginator(state, listId, preloaded = preload) {
  const paginator = getPaginator(state, listId)
  return paginator.equals(defaultPaginator) ? paginator.merge(preloaded) : paginator
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

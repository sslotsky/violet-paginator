import { defaultPaginator } from '../reducer'
import { translate } from '../pageInfoTranslator'

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
  return paginator.get('updating').includes(itemId)
}

export function isRemoving(state, listId, itemId) {
  const paginator = getPaginator(state, listId)
  return paginator.get('removing').includes(itemId)
}

export function currentQuery(state, listId) {
  return translate(getPaginator(state, listId))
}

import { defaultPaginator } from '../reducer'
import { translate } from '../pageInfoTranslator'

const stateMap = {}
const defaultLocator = listId => state => state[listId]
const preload = { results: [] }

export function registerPaginator(listId, locator = defaultLocator(listId)) {
  stateMap[listId] = locator
  return locator
}

export function getPaginator(listId, state) {
  const locator = stateMap[listId] || defaultLocator(listId)
  return locator(state) || defaultPaginator
}
export function preloadedPaginator(state, listId, preloaded = preload) {
  const paginator = getPaginator(listId, state)
  return paginator.equals(defaultPaginator) ? paginator.merge(preloaded) : paginator
}

export function isUpdating(state, listId, itemId) {
  const paginator = getPaginator(listId, state)
  return paginator.get('updating').includes(itemId)
}

export function isRemoving(state, itemId) {
  return state.get('removing').includes(itemId)
}

export function currentQuery(state, listId) {
  return translate(getPaginator(state, listId))
}

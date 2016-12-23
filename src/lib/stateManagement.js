import { defaultPaginator } from '../reducer'
import { translate } from '../pageInfoTranslator'

const stateMap = {}
const defaultLocator = listId => state => state[listId]
const preload = { results: [] }

export function registerPaginator({
  listId,
  fetch,
  initialSettings = {},
  locator = defaultLocator(listId)
}) {
  stateMap[listId] = {
    locator,
    fetch,
    initialSettings
  }

  return locator
}

export function getPaginator(listId, state) {
  const config = stateMap[listId] || {
    locator: defaultLocator(listId),
    initialSettings: {}
  }

  const paginator = config.locator(state) || defaultPaginator
  return paginator.merge(config.initialSettings)
}

export function getFetcher(listId) {
  return stateMap[listId].fetch
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

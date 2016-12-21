import Immutable, { Map, List, Set } from 'immutable'
import { resolveEach, updateListItem } from './lib/reduxResolver'
import actionType, * as actionTypes from './actionTypes'
import { recordProps } from './pageInfoTranslator'
import { registerPaginator } from './lib/stateManagement'

export const defaultPaginator = Map({
  page: 1,
  pageSize: 15,
  totalCount: 0,
  sort: null,
  sortReverse: false,
  isLoading: false,
  stale: false,
  results: List(),
  updating: Set(),
  removing: Set(),
  requestId: null,
  loadError: null,
  filters: Map()
})

function initialize(state, action) {
  const { type: _, filters = {}, preloaded = {}, ...rest } = action
  const { results = [], totalCount = 0, page = 1 } = preloaded

  return state.merge({
    filters,
    results,
    totalCount,
    page,
    ...rest
  })
}

function expire(state) {
  return state.set('stale', true)
}

function expireAll(state) {
  return state.set('stale', true)
}

function next(state) {
  return state.set('page', state.get('page') + 1)
}

function prev(state) {
  return state.set('page', state.get('page') - 1)
}

function goToPage(state, action) {
  return state.set('page', action.page)
}

function setPageSize(state, action) {
  return state.merge({
    pageSize: action.size,
    page: 1
  })
}

function fetching(state, action) {
  return state.merge({
    isLoading: true,
    requestId: action.requestId
  })
}

function updateResults(state, action) {
  if (action.requestId !== state.get('requestId')) {
    return state
  }

  return state.merge({
    results: Immutable.fromJS(action.results),
    totalCount: action.totalCount,
    isLoading: false,
    stale: false
  })
}

function resetResults(state, action) {
  return state.set('results', Immutable.fromJS(action.results))
}

function toggleFilterItem(state, action) {
  const items = state.getIn(['filters', action.field], Set()).toSet()

  return state.set('page', 1).setIn(
    ['filters', action.field],
    items.includes(action.value) ? items.delete(action.value) :items.add(action.value)
  )
}

function setFilter(state, action) {
  return state.setIn(
    ['filters', action.field],
    Immutable.fromJS(action.value)
  ).set('page', 1)
}

function setFilters(state, action) {
  return state.set(
    'filters',
    state.get('filters').merge(action.filters)
  ).set('page', 1)
}

function resetFilters(state, action) {
  return state.set(
    'filters',
    Immutable.fromJS(action.filters || {})
  ).set('page', 1)
}

function sortChanged(state, action) {
  return state.merge({
    sort: action.field,
    sortReverse: action.reverse,
    page: 1
  })
}

function error(state, action) {
  return state.merge({
    isLoading: false,
    loadError: action.error
  })
}

function updatingItem(state, action) {
  return state.set('updating', state.get('updating').add(action.itemId))
}

function updateItem(state, action) {
  return state.merge({
    updating: state.get('updating').toSet().delete(action.itemId),
    results: updateListItem(
      state.get('results'), action.itemId,
      item => item.merge(action.data).set('error', null),
      recordProps().identifier
    )
  })
}

function updateItems(state, action) {
  const itemIds = action.every ?
    state.get('results').map(r => r.get(recordProps().identifier)) :
    action.itemIds

  return state.merge({
    updating: state.get('updating').toSet().subtract(itemIds),
    results: state.get('results').map(r => {
      if (itemIds.includes(r.get(recordProps().identifier))) {
        return r.merge(action.data).set('error', null)
      }

      return r
    })
  })
}

function updatingItems(state, action) {
  const itemIds = action.every ?
    state.get('results').map(r => r.get(recordProps().identifier)) :
    action.itemIds

  return state.set('updating', state.get('updating').toSet().union(itemIds))
}

function resetItem(state, action) {
  return state.merge({
    updating: state.get('updating').toSet().delete(action.itemId),
    results: updateListItem(
      state.get('results'), action.itemId,
      () => Immutable.fromJS(action.data),
      recordProps().identifier
    )
  })
}

function updatingAll(state, action) {
  return updatingItems(state, {
    every: true,
    ...action
  })
}

function updateAll(state, action) {
  return updateItems(state, {
    every: true,
    ...action
  })
}

function removingItem(state, action) {
  return state.set('removing', state.get('removing').add(action.itemId))
}

function removeItem(state, action) {
  return state.merge({
    totalCount: state.get('totalCount') - 1,
    removing: state.get('removing').toSet().delete(action.itemId),
    results: state.get('results').filter(
      item => item.get(recordProps().identifier) !== action.itemId
    )
  })
}

function itemError(state, action) {
  return state.merge({
    updating: state.get('updating').toSet().delete(action.itemId),
    removing: state.get('removing').toSet().delete(action.itemId),
    results: updateListItem(
      state.get('results'),
      action.itemId,
      item => item.set('error', action.error),
      recordProps().identifier
    )
  })
}

function markItemsErrored(state, action) {
  const itemIds = action.every ?
    state.get('results').map(r => r.get(recordProps().identifier)) :
    action.itemIds

  return state.merge({
    updating: state.get('updating').toSet().subtract(itemIds),
    removing: state.get('removing').toSet().subtract(itemIds),
    results: state.get('results').map(r => {
      if (itemIds.includes(r.get(recordProps().identifier))) {
        return r.set('error', action.error)
      }

      return r
    })
  })
}

function bulkError(state, action) {
  return markItemsErrored(state, {
    every: true,
    ...action
  })
}

export default function createPaginator(id, locator) {
  registerPaginator(id, locator)

  return resolveEach(defaultPaginator, {
    [actionType(actionTypes.INITIALIZE_PAGINATOR, id)]: initialize,
    [actionType(actionTypes.EXPIRE_PAGINATOR, id)]: expire,
    [actionTypes.EXPIRE_ALL]: expireAll,
    [actionType(actionTypes.PREVIOUS_PAGE, id)]: prev,
    [actionType(actionTypes.NEXT_PAGE, id)]: next,
    [actionType(actionTypes.GO_TO_PAGE, id)]: goToPage,
    [actionType(actionTypes.SET_PAGE_SIZE, id)]: setPageSize,
    [actionType(actionTypes.FETCH_RECORDS, id)]: fetching,
    [actionType(actionTypes.RESULTS_UPDATED, id)]: updateResults,
    [actionType(actionTypes.RESULTS_UPDATED_ERROR, id)]: error,
    [actionType(actionTypes.TOGGLE_FILTER_ITEM, id)]: toggleFilterItem,
    [actionType(actionTypes.SET_FILTER, id)]: setFilter,
    [actionType(actionTypes.SET_FILTERS, id)]: setFilters,
    [actionType(actionTypes.RESET_FILTERS, id)]: resetFilters,
    [actionType(actionTypes.SORT_CHANGED, id)]: sortChanged,
    [actionType(actionTypes.UPDATING_ITEM, id)]: updatingItem,
    [actionType(actionTypes.UPDATE_ITEM, id)]: updateItem,
    [actionType(actionTypes.UPDATING_ITEMS, id)]: updatingItems,
    [actionType(actionTypes.UPDATE_ITEMS, id)]: updateItems,
    [actionType(actionTypes.RESET_ITEM, id)]: resetItem,
    [actionType(actionTypes.UPDATING_ALL, id)]: updatingAll,
    [actionType(actionTypes.MARK_ITEMS_ERRORED, id)]: markItemsErrored,
    [actionType(actionTypes.BULK_ERROR, id)]: bulkError,
    [actionType(actionTypes.RESET_RESULTS, id)]: resetResults,
    [actionType(actionTypes.UPDATE_ALL, id)]: updateAll,
    [actionType(actionTypes.REMOVING_ITEM, id)]: removingItem,
    [actionType(actionTypes.REMOVE_ITEM, id)]: removeItem,
    [actionType(actionTypes.ITEM_ERROR, id)]: itemError
  })
}

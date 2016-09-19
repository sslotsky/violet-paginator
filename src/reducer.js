import Immutable, { Map, List, Set } from 'immutable'
import { resolveEach, updateListItem } from './lib/reduxResolver'
import * as actionTypes from './actionTypes'
import { recordProps } from './pageInfoTranslator'

export const initialState = List()

export const defaultPaginator = Map({
  id: null,
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
  if (state.some(p => p.get('id') === action.id)) {
    return state
  }

  const { type: _, filters, ...rest } = action
  return state.push(defaultPaginator.merge({
    filters: Immutable.fromJS(filters || {}),
    ...rest
  }))
}

function destroy(state, action) {
  return state.filter(p => p.get('id') !== action.id)
}

function destroyAll() {
  return initialState
}

function expire(state, action) {
  return updateListItem(state, action.id, p =>
    p.set('stale', true)
  )
}

function expireAll(state) {
  return state.map(p => p.set('stale', true))
}

function next(state, action) {
  return updateListItem(state, action.id, p =>
    p.set('page', p.get('page') + 1)
  )
}

function prev(state, action) {
  return updateListItem(state, action.id, p =>
    p.set('page', p.get('page') - 1)
  )
}

function goToPage(state, action) {
  return updateListItem(state, action.id, p =>
    p.set('page', action.page)
  )
}

function setPageSize(state, action) {
  return updateListItem(state, action.id, p =>
    p.merge({
      pageSize: action.size,
      page: 1
    })
  )
}

function fetching(state, action) {
  return updateListItem(state, action.id, p =>
    p.merge({
      isLoading: true,
      requestId: action.requestId
    })
  )
}

function updateResults(state, action) {
  return updateListItem(state, action.id, p => {
    if (action.requestId !== p.get('requestId')) {
      return p
    }

    return p.merge({
      results: Immutable.fromJS(action.results),
      totalCount: action.totalCount,
      isLoading: false,
      stale: false
    })
  })
}

function toggleFilterItem(state, action) {
  return updateListItem(state, action.id, p => {
    const items = (p.getIn(['filters', action.field]) || Set()).toSet()
    p.set('page', 1)
    return items.includes(action.value) ?
      p.setIn(['filters', action.field], items.delete(action.value)) :
      p.setIn(['filters', action.field], items.add(action.value))
  })
}

function setFilter(state, action) {
  return updateListItem(state, action.id, p =>
    p.setIn(
      ['filters', action.field],
      Immutable.fromJS(action.value)
    ).set('page', 1)
  )
}

function setFilters(state, action) {
  return updateListItem(state, action.id, p =>
    p.mergeDeep({
      filters: Immutable.fromJS(action.filters)
    }).set('page', 1)
  )
}

function resetFilters(state, action) {
  return updateListItem(state, action.id, p =>
    p.set(
      'filters',
      Immutable.fromJS(action.filters || {})
    ).set('page', 1)
  )
}

function sortChanged(state, action) {
  return updateListItem(state, action.id, p =>
    p.merge({
      sort: action.field,
      sortReverse: action.reverse,
      page: 1
    })
  )
}

function error(state, action) {
  return updateListItem(state, action.id, p =>
    p.merge({
      isLoading: false,
      loadError: action.error
    })
  )
}

function updatingItem(state, action) {
  return updateListItem(state, action.id, p =>
    p.set('updating', p.get('updating').add(action.itemId))
  )
}

function updateItem(state, action) {
  return updateListItem(state, action.id, p =>
    p.merge({
      updating: p.get('updating').toSet().delete(action.itemId),
      results: updateListItem(
        p.get('results'), action.itemId,
        item => item.merge(action.data).set('error', null),
        recordProps().identifier
      )
    })
  )
}

function removingItem(state, action) {
  return updateListItem(state, action.id, p =>
    p.set('removing', p.get('removing').add(action.itemId))
  )
}

function removeItem(state, action) {
  return updateListItem(state, action.id, p =>
    p.merge({
      totalCount: p.get('totalCount') - 1,
      removing: p.get('removing').toSet().delete(action.itemId),
      results: p.get('results').filter(
        item => item.get(recordProps().identifier) !== action.itemId
      )
    })
  )
}

function itemError(state, action) {
  return updateListItem(state, action.id, p =>
    p.merge({
      updating: p.get('updating').toSet().delete(action.itemId),
      removing: p.get('removing').toSet().delete(action.itemId),
      error: action.error
    })
  )
}

export default resolveEach(initialState, {
  [actionTypes.INITIALIZE_PAGINATOR]: initialize,
  [actionTypes.DESTROY_PAGINATOR]: destroy,
  [actionTypes.DESTROY_ALL]: destroyAll,
  [actionTypes.EXPIRE_PAGINATOR]: expire,
  [actionTypes.EXPIRE_ALL]: expireAll,
  [actionTypes.PREVIOUS_PAGE]: prev,
  [actionTypes.NEXT_PAGE]: next,
  [actionTypes.GO_TO_PAGE]: goToPage,
  [actionTypes.SET_PAGE_SIZE]: setPageSize,
  [actionTypes.FETCH_RECORDS]: fetching,
  [actionTypes.RESULTS_UPDATED]: updateResults,
  [actionTypes.RESULTS_UPDATED_ERROR]: error,
  [actionTypes.TOGGLE_FILTER_ITEM]: toggleFilterItem,
  [actionTypes.SET_FILTER]: setFilter,
  [actionTypes.SET_FILTERS]: setFilters,
  [actionTypes.RESET_FILTERS]: resetFilters,
  [actionTypes.SORT_CHANGED]: sortChanged,
  [actionTypes.UPDATING_ITEM]: updatingItem,
  [actionTypes.UPDATE_ITEM]: updateItem,
  [actionTypes.REMOVING_ITEM]: removingItem,
  [actionTypes.REMOVE_ITEM]: removeItem,
  [actionTypes.ITEM_ERROR]: itemError
})

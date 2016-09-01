import Immutable, { Map, List, Set } from 'immutable'
import { resolveEach, updateListItem } from './lib/reduxResolver'
import * as actionTypes from './actionTypes'

const initialState = List()

export const defaultPaginator = Map({
  id: null,
  page: 1,
  pageSize: 15,
  totalCount: 0,
  sort: null,
  sortReverse: false,
  isLoading: false,
  results: List(),
  updating: null,
  loadError: null,
  filters: Map()
})

function initialize(state, action) {
  if (state.some(p => p.get('id') === action.id)) {
    return state
  }

  const { type: _, ...rest } = action
  return state.push(defaultPaginator.merge({ ...rest }))
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
    p.set('pageSize', action.size)
  )
}

function fetching(state, action) {
  return updateListItem(state, action.id, p =>
    p.set('isLoading', true)
  )
}

function updateResults(state, action) {
  return updateListItem(state, action.id, p =>
    p.merge({
      results: Immutable.fromJS(action.results),
      totalCount: action.totalCount,
      isLoading: false
    })
  )
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
    p.set('updating', action.itemId)
  )
}

function updateItem(state, action) {
  return updateListItem(state, action.id, p =>
    p.merge({
      updating: null,
      results: updateListItem(p.get('results'), action.itemId, item =>
        item.merge(action.data)
      )
    })
  )
}

function removeItem(state, action) {
  return updateListItem(state, action.id, p =>
    p.merge({
      results: p.get('results').filter(item => item.get('id') !== action.itemId),
      totalCount: p.get('totalCount') - 1
    })
  )
}

export default resolveEach(initialState, {
  [actionTypes.INITIALIZE_PAGINATOR]: initialize,
  [actionTypes.PREVIOUS_PAGE]: prev,
  [actionTypes.NEXT_PAGE]: next,
  [actionTypes.GO_TO_PAGE]: goToPage,
  [actionTypes.SET_PAGE_SIZE]: setPageSize,
  [actionTypes.FETCH_RECORDS]: fetching,
  [actionTypes.RESULTS_UPDATED]: updateResults,
  [actionTypes.RESULTS_UPDATED_ERROR]: error,
  [actionTypes.TOGGLE_FILTER_ITEM]: toggleFilterItem,
  [actionTypes.SET_FILTER]: setFilter,
  [actionTypes.SORT_CHANGED]: sortChanged,
  [actionTypes.UPDATING_ITEM]: updatingItem,
  [actionTypes.UPDATE_ITEM]: updateItem,
  [actionTypes.REMOVE_ITEM]: removeItem
})

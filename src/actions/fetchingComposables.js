import uuid from 'uuid'
import * as actionTypes from '../actionTypes'
import { translate, responseProps } from '../pageInfoTranslator'
import getPaginator from '../lib/stateManagement'

const [totalCountProp, resultsProp] = responseProps()

const defaultConfig = {
  isBoundToDispatch: true
}

const fetcher = customConfig =>
  (dispatch, getState) => {
    const config = { ...defaultConfig, ...customConfig }
    const id = config.listId
    const pageInfo = getPaginator(getState(), id)
    const requestId = uuid.v1()

    dispatch({ type: actionTypes.FETCH_RECORDS, id, requestId })

    const promise = config.isBoundToDispatch ?
      config.fetch(translate(pageInfo)) :
      dispatch(config.fetch(translate(pageInfo)))

    return promise.then(resp =>
      dispatch({
        type: actionTypes.RESULTS_UPDATED,
        results: resp.data[config.resultsProp || resultsProp],
        totalCount: resp.data[config.totalCountProp || totalCountProp],
        id,
        requestId
      })
    ).catch(error =>
      dispatch({
        type: actionTypes.RESULTS_UPDATED_ERROR,
        error,
        id
      })
    )
  }

export default function fetchingComposables(config) {
  const fetch = fetcher(config)
  const id = config.listId
  const execute = action => dispatch => {
    dispatch(action)
    return dispatch(fetch)
  }

  return {
    initialize: () => (dispatch, getState) => {
      if (getState().pagination.some(p => p.get('id') === config.listId)) {
        return dispatch({ type: actionTypes.FOUND_PAGINATOR, id })
      }

      const action = {
        type: actionTypes.INITIALIZE_PAGINATOR,
        id: config.listId
      }

      if (config.pageSize) {
        action.pageSize = config.pageSize
      }

      if (config.filters) {
        action.filters = config.filters
      }

      if (config.preloaded) {
        action.preloaded = config.preloaded
        return dispatch(action)
      }

      return dispatch(execute(action))
    },
    reload: () => fetch,
    next: () => execute({
      type: actionTypes.NEXT_PAGE,
      id
    }),
    prev: () => execute({
      type: actionTypes.PREVIOUS_PAGE,
      id
    }),
    goTo: (page) => execute({
      type: actionTypes.GO_TO_PAGE,
      id,
      page
    }),
    setPageSize: (size) => execute({
      type: actionTypes.SET_PAGE_SIZE,
      id,
      size
    }),
    toggleFilterItem: (field, value) => execute({
      type: actionTypes.TOGGLE_FILTER_ITEM,
      id,
      field,
      value
    }),
    setFilter: (field, value) => execute({
      type: actionTypes.SET_FILTER,
      id,
      field,
      value
    }),
    setFilters: (filters) => execute({
      type: actionTypes.SET_FILTERS,
      id,
      filters
    }),
    resetFilters: (filters) => execute({
      type: actionTypes.RESET_FILTERS,
      id,
      filters
    }),
    sort: (field, reverse) => execute({
      type: actionTypes.SORT_CHANGED,
      id,
      field,
      reverse
    })
  }
}


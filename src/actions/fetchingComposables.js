import uuid from 'uuid'
import actionType, * as actionTypes from '../actionTypes'
import { translate, responseProps } from '../pageInfoTranslator'
import { getPaginator, listConfig } from '../lib/stateManagement'

const [totalCountProp, resultsProp] = responseProps()

const fetcher = id =>
  (dispatch, getState) => {
    const { fetch, params } = listConfig(id)
    const pageInfo = getPaginator(id, getState())
    const requestId = uuid.v1()

    dispatch({ type: actionType(actionTypes.FETCH_RECORDS, id), requestId })

    const promise = dispatch(fetch(translate(pageInfo)))

    return promise.then(resp =>
      dispatch({
        type: actionType(actionTypes.RESULTS_UPDATED, id),
        results: resp.data[params.resultsProp || totalCountProp],
        totalCount: resp.data[params.totalCountProp || resultsProp],
        requestId
      })
    ).catch(error =>
      dispatch({
        type: actionType(actionTypes.RESULTS_UPDATED_ERROR, id),
        error
      })
    )
  }

export default function fetchingComposables(config) {
  const fetch = fetcher(config.listId)
  const id = config.listId
  const execute = action => dispatch => {
    dispatch(action)
    return dispatch(fetch)
  }

  return {
    initialize: () => dispatch => {
      const action = {
        type: actionType(actionTypes.INITIALIZE_PAGINATOR, id)
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
      type: actionType(actionTypes.NEXT_PAGE, id)
    }),
    prev: () => execute({
      type: actionType(actionTypes.PREVIOUS_PAGE, id)
    }),
    goTo: (page) => execute({
      type: actionType(actionTypes.GO_TO_PAGE, id),
      page
    }),
    setPageSize: (size) => execute({
      type: actionType(actionTypes.SET_PAGE_SIZE, id),
      size
    }),
    toggleFilterItem: (field, value) => execute({
      type: actionType(actionTypes.TOGGLE_FILTER_ITEM, id),
      field,
      value
    }),
    setFilter: (field, value) => execute({
      type: actionType(actionTypes.SET_FILTER, id),
      field,
      value
    }),
    setFilters: (filters) => execute({
      type: actionType(actionTypes.SET_FILTERS, id),
      filters
    }),
    resetFilters: (filters) => execute({
      type: actionType(actionTypes.RESET_FILTERS, id),
      filters
    }),
    sort: (field, reverse) => execute({
      type: actionType(actionTypes.SORT_CHANGED, id),
      field,
      reverse
    })
  }
}


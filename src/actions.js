import uuid from 'uuid'
import * as actionTypes from './actionTypes'
import { translate, responseProps } from './pageInfoTranslator'

const [totalCountProp, resultsProp] = responseProps()

const defaultConfig = {
  isBoundToDispatch: true
}

const fetcher = customConfig =>
  (dispatch, getState) => {
    const config = { ...defaultConfig, ...customConfig }
    const id = config.listId
    const pageInfo = getState().pagination.find(p => p.get('id') === id)
    const requestId = uuid.v1()

    dispatch({ type: actionTypes.FETCH_RECORDS, id, requestId })

    const promise = config.isBoundToDispatch ?
      config.fetch(translate(pageInfo)) :
      dispatch(config.fetch(translate(pageInfo)))

    return promise.then(resp =>
      dispatch({
        type: actionTypes.RESULTS_UPDATED,
        results: resp.data[resultsProp],
        totalCount: resp.data[totalCountProp],
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

export default function register(config) {
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

      return dispatch(execute(action))
    },
    reload: fetch,
    next: () => dispatch =>
      dispatch(
        execute({
          type: actionTypes.NEXT_PAGE,
          id
        })
      ),
    prev: () => dispatch =>
      dispatch(
        execute({
          type: actionTypes.PREVIOUS_PAGE,
          id
        })
      ),
    goTo: (page) => dispatch =>
      dispatch(
        execute({
          type: actionTypes.GO_TO_PAGE,
          id,
          page
        })
      ),
    setPageSize: (size) => dispatch =>
      dispatch(
        execute({
          type: actionTypes.SET_PAGE_SIZE,
          id,
          size
        })
      ),
    toggleFilterItem: (field, value) => dispatch =>
      dispatch(
        execute({
          type: actionTypes.TOGGLE_FILTER_ITEM,
          id,
          field,
          value
        })
      ),
    setFilter: (field, value) => dispatch =>
      dispatch(
        execute({
          type: actionTypes.SET_FILTER,
          id,
          field,
          value
        })
      ),
    sort: (field, reverse) => dispatch =>
      dispatch(
        execute({
          type: actionTypes.SORT_CHANGED,
          id,
          field,
          reverse
        })
      ),
    updatingItem: (itemId) => dispatch =>
      dispatch({
        type: actionTypes.UPDATING_ITEM,
        id,
        itemId
      }),
    updateItem: (itemId, data) => dispatch =>
      dispatch({
        type: actionTypes.UPDATE_ITEM,
        id,
        itemId,
        data
      }),
    removingItem: (itemId) => dispatch =>
      dispatch({
        type: actionTypes.REMOVING_ITEM,
        id,
        itemId
      }),
    removeItem: (itemId) => dispatch =>
      dispatch({
        type: actionTypes.REMOVE_ITEM,
        id,
        itemId
      })
  }
}

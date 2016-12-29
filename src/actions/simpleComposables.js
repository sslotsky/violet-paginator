import { Map } from 'immutable'
import getPaginator from '../lib/stateManagement'
import { recordProps } from '../pageInfoTranslator'
import * as actionTypes from '../actionTypes'

const { identifier } = recordProps()

export default function simpleComposables(id) {
  const basic = {
    destroy: () => ({
      type: actionTypes.DESTROY_PAGINATOR,
      id
    }),
    expire: () => ({
      type: actionTypes.EXPIRE_PAGINATOR,
      id
    }),
    updatingItem: (itemId) => ({
      type: actionTypes.UPDATING_ITEM,
      id,
      itemId
    }),
    updateItem: (itemId, data) => ({
      type: actionTypes.UPDATE_ITEM,
      id,
      itemId,
      data
    }),
    updatingItems: (itemIds) => ({
      type: actionTypes.UPDATING_ITEMS,
      id,
      itemIds
    }),
    updateItems: (itemIds, data) => ({
      type: actionTypes.UPDATE_ITEMS,
      id,
      itemIds,
      data
    }),
    resetItem: (itemId, data) => ({
      type: actionTypes.RESET_ITEM,
      id,
      itemId,
      data
    }),
    updatingAll: () => ({
      type: actionTypes.UPDATING_ALL,
      id
    }),
    updateAll: (data) => ({
      type: actionTypes.UPDATE_ALL,
      id,
      data
    }),
    bulkError: (error) => ({
      type: actionTypes.BULK_ERROR,
      id,
      error
    }),
    markItemsErrored: (itemIds, error) => ({
      type: actionTypes.MARK_ITEMS_ERRORED,
      id,
      itemIds,
      error
    }),
    resetResults: (results) => ({
      type: actionTypes.RESET_RESULTS,
      id,
      results
    }),
    removingItem: (itemId) => ({
      type: actionTypes.REMOVING_ITEM,
      id,
      itemId
    }),
    removeItem: (itemId) => ({
      type: actionTypes.REMOVE_ITEM,
      id,
      itemId
    }),
    itemError: (itemId, error) => ({
      type: actionTypes.ITEM_ERROR,
      id,
      itemId,
      error
    })
  }

  const updateAsync = (itemId, data, update) =>
    (dispatch, getState) => {
      const item = getPaginator(getState(), id).get('results')
        .find(r => r.get(identifier) === itemId) || Map()

      dispatch(basic.updateItem(itemId, data))
      dispatch(basic.updatingItem(itemId))
      return update.then(serverUpdate =>
        dispatch(basic.updateItem(itemId, serverUpdate))
      ).catch(err => {
        dispatch(basic.resetItem(itemId, item.toJS()))
        return dispatch(basic.itemError(itemId, err))
      })
    }

  const updateItemsAsync = (itemIds, data, update, showUpdating = true) =>
    (dispatch, getState) => {
      const results = getPaginator(getState(), id).get('results')

      dispatch(basic.updateItems(itemIds, data))
      if (showUpdating) {
        dispatch(basic.updatingItems(itemIds))
      }

      return update.then(resp => {
        if (showUpdating) {
          dispatch(basic.updateItems(itemIds, data))
        }

        return resp
      }).catch(err => {
        dispatch(basic.resetResults(results.toJS()))
        return dispatch(basic.markItemsErrored(itemIds, err))
      })
    }

  const updateAllAsync = (data, update, reset=false) =>
    (dispatch, getState) => {
      const results = getPaginator(getState(), id).get('results')
      const ids = results.map(r => r.get(identifier)).toArray()

      return dispatch(updateItemsAsync(ids, data, update)).then(resp => {
        if (resp.type === actionTypes.MARK_ITEMS_ERRORED) {
          return {}
        }

        if (reset) {
          return dispatch(basic.resetResults(resp))
        }

        return dispatch(basic.updateItems(ids, resp))
      })
    }

  const removeAsync = (itemId, remove) =>
    (dispatch, getState) => {
      const item = getPaginator(getState(), id).get('results')
        .find(r => r.get(identifier) === itemId) || Map()

      dispatch(basic.removingItem(itemId))
      return remove.then(() =>
        dispatch(basic.removeItem(itemId))
      ).catch(err => {
        dispatch(basic.resetItem(itemId, item.toJS()))
        return dispatch(basic.itemError(itemId, err))
      })
    }

  return {
    ...basic,
    updateAsync,
    updateItemsAsync,
    updateAllAsync,
    removeAsync
  }
}


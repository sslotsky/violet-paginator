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
        .find(r => r.get(identifier) === itemId)

      dispatch(basic.updateItem(itemId, data))
      dispatch(basic.updatingItem(itemId))
      return update.then(serverUpdate =>
        dispatch(basic.updateItem(itemId, serverUpdate))
      ).catch(err => {
        dispatch(basic.resetItem(itemId, item.toJS()))
        return dispatch(basic.itemError(itemId, err))
      })
    }

  const updateAllAsync = (data, update, reset=false) =>
    (dispatch, getState) => {
      const results = getPaginator(getState(), id).get('results')

      dispatch(basic.updateAll(data))
      dispatch(basic.updatingAll())
      return update.then(serverUpdate => {
        if (reset) {
          return dispatch(basic.resetResults(serverUpdate))
        }

        return dispatch(basic.updateAll(serverUpdate))
      }).catch(err => {
        dispatch(basic.resetResults(results.toJS()))
        return dispatch(basic.bulkError(err))
      })
    }

  return {
    ...basic,
    updateAsync,
    updateAllAsync
  }
}


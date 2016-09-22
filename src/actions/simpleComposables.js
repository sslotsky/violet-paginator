import * as actionTypes from '../actionTypes'

export default function simpleComposables(id) {
  return {
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
}


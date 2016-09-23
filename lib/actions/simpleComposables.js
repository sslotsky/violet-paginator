'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = simpleComposables;

var _actionTypes = require('../actionTypes');

var actionTypes = _interopRequireWildcard(_actionTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function simpleComposables(id) {
  return {
    destroy: function destroy() {
      return {
        type: actionTypes.DESTROY_PAGINATOR,
        id: id
      };
    },
    expire: function expire() {
      return {
        type: actionTypes.EXPIRE_PAGINATOR,
        id: id
      };
    },
    updatingItem: function updatingItem(itemId) {
      return {
        type: actionTypes.UPDATING_ITEM,
        id: id,
        itemId: itemId
      };
    },
    updateItem: function updateItem(itemId, data) {
      return {
        type: actionTypes.UPDATE_ITEM,
        id: id,
        itemId: itemId,
        data: data
      };
    },
    removingItem: function removingItem(itemId) {
      return {
        type: actionTypes.REMOVING_ITEM,
        id: id,
        itemId: itemId
      };
    },
    removeItem: function removeItem(itemId) {
      return {
        type: actionTypes.REMOVE_ITEM,
        id: id,
        itemId: itemId
      };
    },
    itemError: function itemError(itemId, error) {
      return {
        type: actionTypes.ITEM_ERROR,
        id: id,
        itemId: itemId,
        error: error
      };
    }
  };
}
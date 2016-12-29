'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = simpleComposables;

var _immutable = require('immutable');

var _stateManagement = require('../lib/stateManagement');

var _stateManagement2 = _interopRequireDefault(_stateManagement);

var _pageInfoTranslator = require('../pageInfoTranslator');

var _actionTypes = require('../actionTypes');

var actionTypes = _interopRequireWildcard(_actionTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _recordProps = (0, _pageInfoTranslator.recordProps)();

var identifier = _recordProps.identifier;
function simpleComposables(id) {
  var basic = {
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
    updatingItems: function updatingItems(itemIds) {
      return {
        type: actionTypes.UPDATING_ITEMS,
        id: id,
        itemIds: itemIds
      };
    },
    updateItems: function updateItems(itemIds, data) {
      return {
        type: actionTypes.UPDATE_ITEMS,
        id: id,
        itemIds: itemIds,
        data: data
      };
    },
    resetItem: function resetItem(itemId, data) {
      return {
        type: actionTypes.RESET_ITEM,
        id: id,
        itemId: itemId,
        data: data
      };
    },
    updatingAll: function updatingAll() {
      return {
        type: actionTypes.UPDATING_ALL,
        id: id
      };
    },
    updateAll: function updateAll(data) {
      return {
        type: actionTypes.UPDATE_ALL,
        id: id,
        data: data
      };
    },
    bulkError: function bulkError(error) {
      return {
        type: actionTypes.BULK_ERROR,
        id: id,
        error: error
      };
    },
    markItemsErrored: function markItemsErrored(itemIds, error) {
      return {
        type: actionTypes.MARK_ITEMS_ERRORED,
        id: id,
        itemIds: itemIds,
        error: error
      };
    },
    resetResults: function resetResults(results) {
      return {
        type: actionTypes.RESET_RESULTS,
        id: id,
        results: results
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

  var updateAsync = function updateAsync(itemId, data, update) {
    return function (dispatch, getState) {
      var item = (0, _stateManagement2.default)(getState(), id).get('results').find(function (r) {
        return r.get(identifier) === itemId;
      }) || (0, _immutable.Map)();

      dispatch(basic.updateItem(itemId, data));
      dispatch(basic.updatingItem(itemId));
      return update.then(function (serverUpdate) {
        return dispatch(basic.updateItem(itemId, serverUpdate));
      }).catch(function (err) {
        dispatch(basic.resetItem(itemId, item.toJS()));
        return dispatch(basic.itemError(itemId, err));
      });
    };
  };

  var updateItemsAsync = function updateItemsAsync(itemIds, data, update) {
    var showUpdating = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];
    return function (dispatch, getState) {
      var results = (0, _stateManagement2.default)(getState(), id).get('results');

      dispatch(basic.updateItems(itemIds, data));
      if (showUpdating) {
        dispatch(basic.updatingItems(itemIds));
      }

      return update.then(function (resp) {
        if (showUpdating) {
          dispatch(basic.updateItems(itemIds, data));
        }

        return resp;
      }).catch(function (err) {
        dispatch(basic.resetResults(results.toJS()));
        return dispatch(basic.markItemsErrored(itemIds, err));
      });
    };
  };

  var updateAllAsync = function updateAllAsync(data, update) {
    var reset = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
    return function (dispatch, getState) {
      var results = (0, _stateManagement2.default)(getState(), id).get('results');
      var ids = results.map(function (r) {
        return r.get(identifier);
      }).toArray();

      return dispatch(updateItemsAsync(ids, data, update)).then(function (resp) {
        if (resp.type === actionTypes.MARK_ITEMS_ERRORED) {
          return {};
        }

        if (reset) {
          return dispatch(basic.resetResults(resp));
        }

        return dispatch(basic.updateItems(ids, resp));
      });
    };
  };

  var removeAsync = function removeAsync(itemId, remove) {
    return function (dispatch, getState) {
      var item = (0, _stateManagement2.default)(getState(), id).get('results').find(function (r) {
        return r.get(identifier) === itemId;
      }) || (0, _immutable.Map)();

      dispatch(basic.removingItem(itemId));
      return remove.then(function () {
        return dispatch(basic.removeItem(itemId));
      }).catch(function (err) {
        dispatch(basic.resetItem(itemId, item.toJS()));
        return dispatch(basic.itemError(itemId, err));
      });
    };
  };

  return _extends({}, basic, {
    updateAsync: updateAsync,
    updateItemsAsync: updateItemsAsync,
    updateAllAsync: updateAllAsync,
    removeAsync: removeAsync
  });
}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = fetchingComposables;

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _actionTypes = require('../actionTypes');

var actionTypes = _interopRequireWildcard(_actionTypes);

var _pageInfoTranslator = require('../pageInfoTranslator');

var _stateManagement = require('../lib/stateManagement');

var _stateManagement2 = _interopRequireDefault(_stateManagement);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _responseProps = (0, _pageInfoTranslator.responseProps)();

var _responseProps2 = _slicedToArray(_responseProps, 2);

var totalCountProp = _responseProps2[0];
var resultsProp = _responseProps2[1];


var defaultConfig = {
  isBoundToDispatch: true
};

var fetcher = function fetcher(customConfig) {
  return function (dispatch, getState) {
    var config = _extends({}, defaultConfig, customConfig);
    var id = config.listId;
    var pageInfo = (0, _stateManagement2.default)(getState(), id);
    var requestId = _uuid2.default.v1();

    dispatch({ type: actionTypes.FETCH_RECORDS, id: id, requestId: requestId });

    var promise = config.isBoundToDispatch ? config.fetch((0, _pageInfoTranslator.translate)(pageInfo)) : dispatch(config.fetch((0, _pageInfoTranslator.translate)(pageInfo)));

    return promise.then(function (resp) {
      return dispatch({
        type: actionTypes.RESULTS_UPDATED,
        results: resp.data[config.resultsProp || resultsProp],
        totalCount: resp.data[config.totalCountProp || totalCountProp],
        id: id,
        requestId: requestId
      });
    }).catch(function (error) {
      return dispatch({
        type: actionTypes.RESULTS_UPDATED_ERROR,
        error: error,
        id: id
      });
    });
  };
};

function fetchingComposables(config) {
  var fetch = fetcher(config);
  var id = config.listId;
  var execute = function execute(action) {
    return function (dispatch) {
      dispatch(action);
      return dispatch(fetch);
    };
  };

  return {
    initialize: function initialize() {
      return function (dispatch, getState) {
        if (getState().pagination.some(function (p) {
          return p.get('id') === config.listId;
        })) {
          return dispatch({ type: actionTypes.FOUND_PAGINATOR, id: id });
        }

        var action = {
          type: actionTypes.INITIALIZE_PAGINATOR,
          id: config.listId
        };

        if (config.pageSize) {
          action.pageSize = config.pageSize;
        }

        if (config.filters) {
          action.filters = config.filters;
        }

        if (config.preloaded) {
          action.preloaded = config.preloaded;
          return dispatch(action);
        }

        return dispatch(execute(action));
      };
    },
    reload: function reload() {
      return fetch;
    },
    next: function next() {
      return execute({
        type: actionTypes.NEXT_PAGE,
        id: id
      });
    },
    prev: function prev() {
      return execute({
        type: actionTypes.PREVIOUS_PAGE,
        id: id
      });
    },
    goTo: function goTo(page) {
      return execute({
        type: actionTypes.GO_TO_PAGE,
        id: id,
        page: page
      });
    },
    setPageSize: function setPageSize(size) {
      return execute({
        type: actionTypes.SET_PAGE_SIZE,
        id: id,
        size: size
      });
    },
    toggleFilterItem: function toggleFilterItem(field, value) {
      return execute({
        type: actionTypes.TOGGLE_FILTER_ITEM,
        id: id,
        field: field,
        value: value
      });
    },
    setFilter: function setFilter(field, value) {
      return execute({
        type: actionTypes.SET_FILTER,
        id: id,
        field: field,
        value: value
      });
    },
    setFilters: function setFilters(filters) {
      return execute({
        type: actionTypes.SET_FILTERS,
        id: id,
        filters: filters
      });
    },
    resetFilters: function resetFilters(filters) {
      return execute({
        type: actionTypes.RESET_FILTERS,
        id: id,
        filters: filters
      });
    },
    sort: function sort(field, reverse) {
      return execute({
        type: actionTypes.SORT_CHANGED,
        id: id,
        field: field,
        reverse: reverse
      });
    }
  };
}
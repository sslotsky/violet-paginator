'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultPaginator = undefined;

var _resolveEach;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _reduxResolver = require('./lib/reduxResolver');

var _actionTypes = require('./actionTypes');

var actionTypes = _interopRequireWildcard(_actionTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var initialState = (0, _immutable.List)();

var defaultPaginator = exports.defaultPaginator = (0, _immutable.Map)({
  id: null,
  page: 1,
  pageSize: 15,
  totalCount: 0,
  sort: null,
  sortReverse: false,
  isLoading: false,
  results: (0, _immutable.List)(),
  loadError: null,
  filters: (0, _immutable.Map)()
});

function initialize(state, action) {
  if (state.some(function (p) {
    return p.get('id') === action.id;
  })) {
    return state;
  }

  var _ = action.type;

  var rest = _objectWithoutProperties(action, ['type']);

  return state.push(defaultPaginator.merge(_extends({}, rest)));
}

function next(state, action) {
  return (0, _reduxResolver.updateListItem)(state, action.id, function (p) {
    return p.merge({ page: p.get('page') + 1 });
  });
}

function prev(state, action) {
  return (0, _reduxResolver.updateListItem)(state, action.id, function (p) {
    return p.merge({ page: p.get('page') - 1 });
  });
}

function goToPage(state, action) {
  return (0, _reduxResolver.updateListItem)(state, action.id, function (p) {
    return p.merge({ page: action.page });
  });
}

function fetching(state, action) {
  return (0, _reduxResolver.updateListItem)(state, action.id, function (p) {
    return p.merge({ isLoading: true });
  });
}

function updateResults(state, action) {
  return (0, _reduxResolver.updateListItem)(state, action.id, function (p) {
    return p.merge({
      results: _immutable2.default.fromJS(action.results),
      totalCount: action.totalCount,
      isLoading: false
    });
  });
}

function toggleFilterItem(state, action) {
  return (0, _reduxResolver.updateListItem)(state, action.id, function (p) {
    var items = (p.getIn(['filters', action.field]) || (0, _immutable.Set)()).toSet();
    p.set('page', 1);
    return items.includes(action.value) ? p.setIn(['filters', action.field], items.delete(action.value)) : p.setIn(['filters', action.field], items.add(action.value));
  });
}

function setFilter(state, action) {
  return (0, _reduxResolver.updateListItem)(state, action.id, function (p) {
    return p.setIn(['filters', action.field], _immutable2.default.fromJS(action.value)).set('page', 1);
  });
}

function sortChanged(state, action) {
  return (0, _reduxResolver.updateListItem)(state, action.id, function (p) {
    return p.set('sort', action.field).set('sortReverse', action.reverse).set('page', 1);
  });
}

function error(state, action) {
  return (0, _reduxResolver.updateListItem)(state, action.id, function (p) {
    return p.merge({
      isLoading: false,
      loadError: action.error
    });
  });
}

function updateItem(state, action) {
  return (0, _reduxResolver.updateListItem)(state, action.id, function (p) {
    return p.set('results', (0, _reduxResolver.updateListItem)(p.get('results'), action.itemId, function (item) {
      return item.merge(action.data);
    }));
  });
}

function removeItem(state, action) {
  return (0, _reduxResolver.updateListItem)(state, action.id, function (p) {
    return p.set('results', p.get('results').filter(function (item) {
      return item.get('id') !== action.itemId;
    })).set('totalCount', p.get('totalCount') - 1);
  });
}

exports.default = (0, _reduxResolver.resolveEach)(initialState, (_resolveEach = {}, _defineProperty(_resolveEach, actionTypes.INITIALIZE_PAGINATOR, initialize), _defineProperty(_resolveEach, actionTypes.PREVIOUS_PAGE, prev), _defineProperty(_resolveEach, actionTypes.NEXT_PAGE, next), _defineProperty(_resolveEach, actionTypes.GO_TO_PAGE, goToPage), _defineProperty(_resolveEach, actionTypes.FETCH_RECORDS, fetching), _defineProperty(_resolveEach, actionTypes.RESULTS_UPDATED, updateResults), _defineProperty(_resolveEach, actionTypes.RESULTS_UPDATED_ERROR, error), _defineProperty(_resolveEach, actionTypes.TOGGLE_FILTER_ITEM, toggleFilterItem), _defineProperty(_resolveEach, actionTypes.SET_FILTER, setFilter), _defineProperty(_resolveEach, actionTypes.SORT_CHANGED, sortChanged), _defineProperty(_resolveEach, actionTypes.UPDATE_ITEM, updateItem), _defineProperty(_resolveEach, actionTypes.REMOVE_ITEM, removeItem), _resolveEach));
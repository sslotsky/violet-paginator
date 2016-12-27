'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultPaginator = exports.initialState = undefined;

var _resolveEach;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _reduxResolver = require('./lib/reduxResolver');

var _actionTypes = require('./actionTypes');

var actionTypes = _interopRequireWildcard(_actionTypes);

var _pageInfoTranslator = require('./pageInfoTranslator');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var initialState = exports.initialState = (0, _immutable.List)();

var defaultPaginator = exports.defaultPaginator = (0, _immutable.Map)({
  id: null,
  page: 1,
  pageSize: 15,
  totalCount: 0,
  sort: null,
  sortReverse: false,
  isLoading: false,
  stale: false,
  results: (0, _immutable.List)(),
  updating: (0, _immutable.Set)(),
  removing: (0, _immutable.Set)(),
  requestId: null,
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
  var _action$filters = action.filters;
  var filters = _action$filters === undefined ? {} : _action$filters;
  var _action$preloaded = action.preloaded;
  var preloaded = _action$preloaded === undefined ? {} : _action$preloaded;

  var rest = _objectWithoutProperties(action, ['type', 'filters', 'preloaded']);

  var _preloaded$results = preloaded.results;
  var results = _preloaded$results === undefined ? [] : _preloaded$results;
  var _preloaded$totalCount = preloaded.totalCount;
  var totalCount = _preloaded$totalCount === undefined ? 0 : _preloaded$totalCount;
  var _preloaded$page = preloaded.page;
  var page = _preloaded$page === undefined ? 1 : _preloaded$page;


  return state.push(defaultPaginator.merge(_extends({
    filters: filters,
    results: results,
    totalCount: totalCount,
    page: page
  }, rest)));
}

function destroy(state, action) {
  return state.filter(function (p) {
    return p.get('id') !== action.id;
  });
}

function destroyAll() {
  return initialState;
}

function expire(state, action) {
  return (0, _reduxResolver.updateListItem)(state, action.id, function (p) {
    return p.set('stale', true);
  });
}

function expireAll(state) {
  return state.map(function (p) {
    return p.set('stale', true);
  });
}

function next(state, action) {
  return (0, _reduxResolver.updateListItem)(state, action.id, function (p) {
    return p.set('page', p.get('page') + 1);
  });
}

function prev(state, action) {
  return (0, _reduxResolver.updateListItem)(state, action.id, function (p) {
    return p.set('page', p.get('page') - 1);
  });
}

function goToPage(state, action) {
  return (0, _reduxResolver.updateListItem)(state, action.id, function (p) {
    return p.set('page', action.page);
  });
}

function setPageSize(state, action) {
  return (0, _reduxResolver.updateListItem)(state, action.id, function (p) {
    return p.merge({
      pageSize: action.size,
      page: 1
    });
  });
}

function fetching(state, action) {
  return (0, _reduxResolver.updateListItem)(state, action.id, function (p) {
    return p.merge({
      isLoading: true,
      requestId: action.requestId
    });
  });
}

function updateResults(state, action) {
  return (0, _reduxResolver.updateListItem)(state, action.id, function (p) {
    if (action.requestId !== p.get('requestId')) {
      return p;
    }

    return p.merge({
      results: _immutable2.default.fromJS(action.results),
      totalCount: action.totalCount,
      isLoading: false,
      stale: false
    });
  });
}

function resetResults(state, action) {
  return (0, _reduxResolver.updateListItem)(state, action.id, function (p) {
    return p.set('results', _immutable2.default.fromJS(action.results));
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

function setFilters(state, action) {
  return (0, _reduxResolver.updateListItem)(state, action.id, function (p) {
    return p.set('filters', p.get('filters').merge(action.filters)).set('page', 1);
  });
}

function resetFilters(state, action) {
  return (0, _reduxResolver.updateListItem)(state, action.id, function (p) {
    return p.set('filters', _immutable2.default.fromJS(action.filters || {})).set('page', 1);
  });
}

function sortChanged(state, action) {
  return (0, _reduxResolver.updateListItem)(state, action.id, function (p) {
    return p.merge({
      sort: action.field,
      sortReverse: action.reverse,
      page: 1
    });
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

function updatingItem(state, action) {
  return (0, _reduxResolver.updateListItem)(state, action.id, function (p) {
    return p.set('updating', p.get('updating').add(action.itemId));
  });
}

function updateItem(state, action) {
  return (0, _reduxResolver.updateListItem)(state, action.id, function (p) {
    return p.merge({
      updating: p.get('updating').toSet().delete(action.itemId),
      results: (0, _reduxResolver.updateListItem)(p.get('results'), action.itemId, function (item) {
        return item.merge(action.data).set('error', null);
      }, (0, _pageInfoTranslator.recordProps)().identifier)
    });
  });
}

function updateItems(state, action) {
  return (0, _reduxResolver.updateListItem)(state, action.id, function (p) {
    var itemIds = action.every ? p.get('results').map(function (r) {
      return r.get((0, _pageInfoTranslator.recordProps)().identifier);
    }) : action.itemIds;

    return p.merge({
      updating: p.get('updating').toSet().subtract(itemIds),
      results: p.get('results').map(function (r) {
        if (itemIds.includes(r.get((0, _pageInfoTranslator.recordProps)().identifier))) {
          return r.merge(action.data).set('error', null);
        }

        return r;
      })
    });
  });
}

function updatingItems(state, action) {
  return (0, _reduxResolver.updateListItem)(state, action.id, function (p) {
    var itemIds = action.every ? p.get('results').map(function (r) {
      return r.get((0, _pageInfoTranslator.recordProps)().identifier);
    }) : action.itemIds;

    return p.set('updating', p.get('updating').toSet().union(itemIds));
  });
}

function resetItem(state, action) {
  return (0, _reduxResolver.updateListItem)(state, action.id, function (p) {
    return p.merge({
      updating: p.get('updating').toSet().delete(action.itemId),
      results: (0, _reduxResolver.updateListItem)(p.get('results'), action.itemId, function () {
        return _immutable2.default.fromJS(action.data);
      }, (0, _pageInfoTranslator.recordProps)().identifier)
    });
  });
}

function updatingAll(state, action) {
  return updatingItems(state, _extends({
    every: true
  }, action));
}

function updateAll(state, action) {
  return updateItems(state, _extends({
    every: true
  }, action));
}

function removingItem(state, action) {
  return (0, _reduxResolver.updateListItem)(state, action.id, function (p) {
    return p.set('removing', p.get('removing').add(action.itemId));
  });
}

function removeItem(state, action) {
  return (0, _reduxResolver.updateListItem)(state, action.id, function (p) {
    return p.merge({
      totalCount: p.get('totalCount') - 1,
      removing: p.get('removing').toSet().delete(action.itemId),
      results: p.get('results').filter(function (item) {
        return item.get((0, _pageInfoTranslator.recordProps)().identifier) !== action.itemId;
      })
    });
  });
}

function itemError(state, action) {
  return (0, _reduxResolver.updateListItem)(state, action.id, function (p) {
    return p.merge({
      updating: p.get('updating').toSet().delete(action.itemId),
      removing: p.get('removing').toSet().delete(action.itemId),
      results: (0, _reduxResolver.updateListItem)(p.get('results'), action.itemId, function (item) {
        return item.set('error', action.error);
      }, (0, _pageInfoTranslator.recordProps)().identifier)
    });
  });
}

function markItemsErrored(state, action) {
  return (0, _reduxResolver.updateListItem)(state, action.id, function (p) {
    var itemIds = action.every ? p.get('results').map(function (r) {
      return r.get((0, _pageInfoTranslator.recordProps)().identifier);
    }) : action.itemIds;

    return p.merge({
      updating: p.get('updating').toSet().subtract(itemIds),
      removing: p.get('removing').toSet().subtract(itemIds),
      results: p.get('results').map(function (r) {
        if (itemIds.includes(r.get((0, _pageInfoTranslator.recordProps)().identifier))) {
          return r.set('error', action.error);
        }

        return r;
      })
    });
  });
}

function bulkError(state, action) {
  return markItemsErrored(state, _extends({
    every: true
  }, action));
}

exports.default = (0, _reduxResolver.resolveEach)(initialState, (_resolveEach = {}, _defineProperty(_resolveEach, actionTypes.INITIALIZE_PAGINATOR, initialize), _defineProperty(_resolveEach, actionTypes.DESTROY_PAGINATOR, destroy), _defineProperty(_resolveEach, actionTypes.DESTROY_ALL, destroyAll), _defineProperty(_resolveEach, actionTypes.EXPIRE_PAGINATOR, expire), _defineProperty(_resolveEach, actionTypes.EXPIRE_ALL, expireAll), _defineProperty(_resolveEach, actionTypes.PREVIOUS_PAGE, prev), _defineProperty(_resolveEach, actionTypes.NEXT_PAGE, next), _defineProperty(_resolveEach, actionTypes.GO_TO_PAGE, goToPage), _defineProperty(_resolveEach, actionTypes.SET_PAGE_SIZE, setPageSize), _defineProperty(_resolveEach, actionTypes.FETCH_RECORDS, fetching), _defineProperty(_resolveEach, actionTypes.RESULTS_UPDATED, updateResults), _defineProperty(_resolveEach, actionTypes.RESULTS_UPDATED_ERROR, error), _defineProperty(_resolveEach, actionTypes.TOGGLE_FILTER_ITEM, toggleFilterItem), _defineProperty(_resolveEach, actionTypes.SET_FILTER, setFilter), _defineProperty(_resolveEach, actionTypes.SET_FILTERS, setFilters), _defineProperty(_resolveEach, actionTypes.RESET_FILTERS, resetFilters), _defineProperty(_resolveEach, actionTypes.SORT_CHANGED, sortChanged), _defineProperty(_resolveEach, actionTypes.UPDATING_ITEM, updatingItem), _defineProperty(_resolveEach, actionTypes.UPDATE_ITEM, updateItem), _defineProperty(_resolveEach, actionTypes.UPDATING_ITEMS, updatingItems), _defineProperty(_resolveEach, actionTypes.UPDATE_ITEMS, updateItems), _defineProperty(_resolveEach, actionTypes.RESET_ITEM, resetItem), _defineProperty(_resolveEach, actionTypes.UPDATING_ALL, updatingAll), _defineProperty(_resolveEach, actionTypes.MARK_ITEMS_ERRORED, markItemsErrored), _defineProperty(_resolveEach, actionTypes.BULK_ERROR, bulkError), _defineProperty(_resolveEach, actionTypes.RESET_RESULTS, resetResults), _defineProperty(_resolveEach, actionTypes.UPDATE_ALL, updateAll), _defineProperty(_resolveEach, actionTypes.REMOVING_ITEM, removingItem), _defineProperty(_resolveEach, actionTypes.REMOVE_ITEM, removeItem), _defineProperty(_resolveEach, actionTypes.ITEM_ERROR, itemError), _resolveEach));
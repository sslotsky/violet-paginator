'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.paginate = paginate;
exports.createStore = createStore;

var _reducer = require('../reducer');

var _reducer2 = _interopRequireDefault(_reducer);

var _internalMiddleware = require('../middleware/internalMiddleware');

var _internalMiddleware2 = _interopRequireDefault(_internalMiddleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var reducers = {};
var state = {};

var getState = function getState() {
  return state;
};

var listeners = [];

function paginate(config) {
  var _ = config.locator,
      rest = _objectWithoutProperties(config, ['locator']);

  var reducer = (0, _reducer2.default)(rest);
  reducers[config.listId] = reducer;
  state[config.listId] = reducer();
  return reducer;
}

var store = null;

var dispatch = function dispatch(action) {
  Object.keys(state).forEach(function (k) {
    state[k] = reducers[k](state[k], action);
  });

  listeners.forEach(function (l) {
    return l();
  });

  return action;
};

var compose = function compose(a, b) {
  for (var _len = arguments.length, rest = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    rest[_key - 2] = arguments[_key];
  }

  if (!b) {
    return a(function (arg) {
      return arg;
    });
  }

  return a(compose.apply(undefined, [b].concat(rest)));
};

function createStore() {
  if (!store) {
    store = {
      getState: getState,
      subscribe: function subscribe(listener) {
        listeners.push(listener);

        return function unsubscribe() {
          listeners.splice(listeners.indexOf(listener), 1);
        };
      }
    };

    var chain = (0, _internalMiddleware2.default)().map(function (m) {
      return m(store);
    });

    store.dispatch = function (action) {
      return dispatch(compose.apply(undefined, _toConsumableArray(chain))(action));
    };
  }

  return store;
}
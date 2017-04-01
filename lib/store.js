'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.paginate = paginate;
exports.createStore = createStore;

var _reducer = require('./reducer');

var _reducer2 = _interopRequireDefault(_reducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var reducers = {};
var state = {};

var getState = function getState() {
  return state;
};

var listeners = [];

var dispatch = function dispatch(action) {
  if (typeof action === 'function') {
    return action(dispatch, getState);
  }

  Object.keys(state).forEach(function (k) {
    state[k] = reducers[k](state[k], action);
  });

  listeners.forEach(function (l) {
    return l();
  });
  return action;
};

function paginate(config) {
  var _ = config.locator,
      rest = _objectWithoutProperties(config, ['locator']);

  var reducer = (0, _reducer2.default)(rest);
  reducers[config.listId] = reducer;
  state[config.listId] = reducer();
  return reducer;
}

var store = null;

function createStore() {
  if (!store) {
    store = {
      getState: getState,
      dispatch: dispatch,
      subscribe: function subscribe(listener) {
        return listeners.push(listener);
      },
      unsubscribe: function unsubscribe(listener) {
        return listeners.splice(listeners.indexOf(listener), 1);
      }
    };
  }

  return store;
}
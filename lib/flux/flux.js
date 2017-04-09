'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFlux = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.initializeStore = initializeStore;
exports.bindActions = bindActions;

var _connect = require('./connect');

var _connect2 = _interopRequireDefault(_connect);

var _store = require('./store');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var flux = {
  decorate: _connect2.default
};

function initializeStore() {
  var store = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _store.createStore)();

  flux = _extends({}, store, { decorate: _connect2.default });
}

function bindActions(actions) {
  return Object.keys(actions).reduce(function (boundActions, k) {
    return _extends({}, boundActions, _defineProperty({}, k, function () {
      return flux.dispatch(actions[k].apply(actions, arguments));
    }));
  }, {});
}

var getFlux = exports.getFlux = function getFlux() {
  return flux;
};
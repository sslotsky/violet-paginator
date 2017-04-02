'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFlux = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.injectFlux = injectFlux;
exports.bindActions = bindActions;
exports.injectStore = injectStore;

var _connect = require('./connect');

var _connect2 = _interopRequireDefault(_connect);

var _store = require('./store');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var store = (0, _store.createStore)();

var flux = {
  dispatch: store.dispatch,
  getState: store.getState,
  decorate: _connect2.default
};

function injectFlux(_ref) {
  var dispatch = _ref.dispatch,
      getState = _ref.getState,
      decorate = _ref.decorate;

  flux = { dispatch: dispatch, getState: getState, decorate: decorate };
}

function bindActions(actions) {
  return Object.keys(actions).reduce(function (boundActions, k) {
    return _extends({}, boundActions, _defineProperty({}, k, function () {
      return flux.dispatch(actions[k].apply(actions, arguments));
    }));
  }, {});
}

function injectStore(_ref2) {
  var decorate = _ref2.decorate,
      getState = _ref2.getState,
      dispatch = _ref2.dispatch;

  flux = { decorate: decorate, getState: getState, dispatch: dispatch, bindActions: bindActions };
}

var getFlux = exports.getFlux = function getFlux() {
  return flux;
};
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /* eslint-disable no-alert, no-console */

var _stateManagement = require('../lib/stateManagement');

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

exports.default = function (store) {
  return function (next) {
    return function (action) {
      var map = (0, _stateManagement.stateInfo)();
      var state = store.getState();
      var serialized = Object.keys(map).reduce(function (s, k) {
        return _extends({}, s, _defineProperty({}, k, map[k].locator(state).toJS()));
      }, {});

      var type = action.type,
          rest = _objectWithoutProperties(action, ['type']);

      console.log('Dispatching:');
      console.log({ type: type, payload: rest });
      console.log('State after dispatch:');
      console.log(serialized);

      return next(action);
    };
  };
};
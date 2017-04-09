'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.debug = debug;
exports.default = getMiddleware;

var _async = require('./async');

var _async2 = _interopRequireDefault(_async);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logging = false;

function debug() {
  var shouldDebug = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

  logging = shouldDebug;
}

function getMiddleware() {
  if (logging) {
    return [_async2.default, _logger2.default];
  }

  return [_async2.default];
}
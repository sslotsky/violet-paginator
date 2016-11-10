'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Prev = Prev;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactFontawesome = require('react-fontawesome');

var _reactFontawesome2 = _interopRequireDefault(_reactFontawesome);

var _PaginationWrapper = require('./PaginationWrapper');

var _PaginationWrapper2 = _interopRequireDefault(_PaginationWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Prev(_ref) {
  var actions = _ref.actions;
  var hasPreviousPage = _ref.hasPreviousPage;

  var prev = _react2.default.createElement(_reactFontawesome2.default, { name: 'chevron-left' });
  var link = hasPreviousPage ? _react2.default.createElement(
    'a',
    { onClick: actions.prev },
    prev
  ) : prev;

  return link;
}

exports.default = (0, _PaginationWrapper2.default)(Prev);
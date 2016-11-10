'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Next = Next;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactFontawesome = require('react-fontawesome');

var _reactFontawesome2 = _interopRequireDefault(_reactFontawesome);

var _PaginationWrapper = require('./PaginationWrapper');

var _PaginationWrapper2 = _interopRequireDefault(_PaginationWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Next(_ref) {
  var actions = _ref.actions;
  var hasNextPage = _ref.hasNextPage;

  var next = _react2.default.createElement(_reactFontawesome2.default, { name: 'chevron-right' });
  var link = hasNextPage ? _react2.default.createElement(
    'a',
    { onClick: actions.next },
    next
  ) : next;

  return link;
}

exports.default = (0, _PaginationWrapper2.default)(Next);
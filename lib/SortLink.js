'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SortLink = SortLink;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactFontawesome = require('react-fontawesome');

var _reactFontawesome2 = _interopRequireDefault(_reactFontawesome);

var _decorators = require('./decorators');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function SortLink(_ref) {
  var pageActions = _ref.pageActions;
  var field = _ref.field;
  var text = _ref.text;
  var sort = _ref.sort;
  var sortReverse = _ref.sortReverse;
  var _ref$sortable = _ref.sortable;
  var sortable = _ref$sortable === undefined ? true : _ref$sortable;

  if (!sortable) {
    return _react2.default.createElement(
      'span',
      null,
      text
    );
  }

  var sortByField = function sortByField() {
    return pageActions.sort(field, !sortReverse);
  };

  var arrow = sort === field && (sortReverse ? 'angle-up' : 'angle-down');

  return _react2.default.createElement(
    'a',
    { onClick: sortByField },
    text,
    ' ',
    _react2.default.createElement(_reactFontawesome2.default, { name: arrow || '' })
  );
}

SortLink.propTypes = {
  sort: _react.PropTypes.string,
  sortReverse: _react.PropTypes.bool,
  pageActions: _react.PropTypes.object,
  field: _react.PropTypes.string.isRequired,
  text: _react.PropTypes.string.isRequired,
  sortable: _react.PropTypes.bool
};

exports.default = (0, _decorators.sort)(SortLink);
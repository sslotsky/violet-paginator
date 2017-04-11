'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Next = Next;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _decorators = require('./decorators');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Next(_ref) {
  var pageActions = _ref.pageActions,
      hasNextPage = _ref.hasNextPage;

  return _react2.default.createElement(
    'button',
    { type: 'button', disabled: !hasNextPage, onClick: pageActions.next },
    _react2.default.createElement('i', { className: 'fa fa-chevron-right' })
  );
}

Next.propTypes = {
  pageActions: _propTypes2.default.shape({
    next: _propTypes2.default.func.isRequired
  }).isRequired,
  hasNextPage: _propTypes2.default.bool
};

exports.default = (0, _decorators.flip)(Next);
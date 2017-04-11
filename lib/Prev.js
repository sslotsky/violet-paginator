'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Prev = Prev;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _decorators = require('./decorators');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Prev(_ref) {
  var pageActions = _ref.pageActions,
      hasPreviousPage = _ref.hasPreviousPage;

  return _react2.default.createElement(
    'button',
    { type: 'button', disabled: !hasPreviousPage, onClick: pageActions.prev },
    _react2.default.createElement('i', { className: 'fa fa-chevron-left' })
  );
}

Prev.propTypes = {
  pageActions: _propTypes2.default.shape({
    prev: _propTypes2.default.func.isRequired
  }).isRequired,
  hasPreviousPage: _propTypes2.default.bool
};

exports.default = (0, _decorators.flip)(Prev);
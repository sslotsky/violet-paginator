'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.DataTable = DataTable;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classNames = require('./lib/classNames');

var _classNames2 = _interopRequireDefault(_classNames);

var _ColumnHeader = require('./ColumnHeader');

var _ColumnHeader2 = _interopRequireDefault(_ColumnHeader);

var _decorators = require('./decorators');

var _DataRow = require('./containers/DataRow');

var _DataRow2 = _interopRequireDefault(_DataRow);

var _TableRow = require('./TableRow');

var _TableRow2 = _interopRequireDefault(_TableRow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function renderRow(headers) {
  return function (id, i) {
    return _react2.default.createElement(_DataRow2.default, {
      key: i,
      itemId: id,
      component: _TableRow2.default,
      index: i,
      headers: headers
    });
  };
}

function DataTable(props) {
  var ids = props.ids,
      headers = props.headers,
      isLoading = props.isLoading,
      _props$className = props.className,
      className = _props$className === undefined ? 'border' : _props$className;


  var headerRow = headers.map(function (h) {
    return _react2.default.createElement(
      'th',
      { key: h.field },
      _react2.default.createElement(_ColumnHeader2.default, _extends({}, props, h))
    );
  });

  var classes = (0, _classNames2.default)(className).withConditional({ loading: isLoading }).load();

  return _react2.default.createElement(
    'table',
    { className: classes },
    _react2.default.createElement(
      'thead',
      null,
      _react2.default.createElement(
        'tr',
        null,
        headerRow
      )
    ),
    _react2.default.createElement(
      'tbody',
      null,
      ids.map(renderRow(headers))
    )
  );
}

DataTable.propTypes = {
  headers: _propTypes2.default.array.isRequired,
  isLoading: _propTypes2.default.bool,
  ids: _propTypes2.default.arrayOf(_propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number])),
  className: _propTypes2.default.string
};

exports.default = (0, _decorators.tabulateLean)(DataTable);
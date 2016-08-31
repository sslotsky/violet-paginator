'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.DataTable = DataTable;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactFontawesome = require('react-fontawesome');

var _reactFontawesome2 = _interopRequireDefault(_reactFontawesome);

var _SortLink = require('./SortLink');

var _PaginationWrapper = require('./PaginationWrapper');

var _PaginationWrapper2 = _interopRequireDefault(_PaginationWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function DataTable(props) {
  var results = props.results;
  var headers = props.headers;
  var isLoading = props.isLoading;


  if (isLoading) {
    return _react2.default.createElement(
      'center',
      null,
      _react2.default.createElement(_reactFontawesome2.default, {
        name: 'spinner',
        spin: true,
        size: '5x'
      })
    );
  }

  var headerRow = headers.map(function (h) {
    return _react2.default.createElement(
      'th',
      { key: h.field },
      _react2.default.createElement(_SortLink.SortLink, _extends({}, props, h))
    );
  });

  var rows = results.map(function (r, i) {
    var columns = headers.map(function (h) {
      var field = h.field;
      var format = h.format;

      var data = r.get(field);
      var displayData = format && format(r) || data;

      return _react2.default.createElement(
        'td',
        { key: field },
        displayData
      );
    });

    return _react2.default.createElement(
      'tr',
      { key: 'results-' + i },
      columns
    );
  });

  return _react2.default.createElement(
    'table',
    { className: 'border' },
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
      rows
    )
  );
}

DataTable.propTypes = {
  headers: _react.PropTypes.array.isRequired,
  isLoading: _react.PropTypes.bool,
  results: _react.PropTypes.object
};

exports.default = (0, _PaginationWrapper2.default)(DataTable);
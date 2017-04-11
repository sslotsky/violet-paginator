'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = TableRow;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classNames = require('./lib/classNames');

var _classNames2 = _interopRequireDefault(_classNames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TableRow(_ref) {
  var record = _ref.record,
      index = _ref.index,
      updating = _ref.updating,
      removing = _ref.removing,
      headers = _ref.headers;

  var classes = (0, _classNames2.default)().withConditional({ updating: updating, removing: removing }).load();
  var columns = headers.map(function (h) {
    var field = h.field,
        format = h.format;

    var data = record[field];
    var displayData = format && format(record, index) || data;

    return _react2.default.createElement(
      'td',
      { key: field },
      displayData
    );
  });

  return _react2.default.createElement(
    'tr',
    { className: classes },
    columns
  );
}

TableRow.propTypes = {
  record: _propTypes2.default.object.isRequired,
  updating: _propTypes2.default.bool,
  removing: _propTypes2.default.bool,
  index: _propTypes2.default.number.isRequired,
  headers: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    format: _propTypes2.default.func,
    field: _propTypes2.default.string.isRequired
  })).isRequired
};
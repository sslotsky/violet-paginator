'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.Paginator = Paginator;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classNames = require('./lib/classNames');

var _classNames2 = _interopRequireDefault(_classNames);

var _paginate = require('./decorators/paginate');

var _paginate2 = _interopRequireDefault(_paginate);

var _range = require('./lib/range');

var _range2 = _interopRequireDefault(_range);

var _PageNumber = require('./PageNumber');

var _Prev = require('./Prev');

var _Next = require('./Next');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function Paginator(props) {
  var currentPage = props.currentPage,
      totalPages = props.totalPages;


  var hasRightEllipsis = totalPages - currentPage >= 7;
  var hasLeftEllipsis = totalPages > 7 && currentPage > 2;
  var minPage = hasLeftEllipsis ? Math.min(currentPage, totalPages - 6) : 2;
  var rangeSize = 7 - [hasRightEllipsis, hasLeftEllipsis].filter(function (h) {
    return h;
  }).length;
  var maxPage = Math.max(minPage + 1, Math.min(totalPages - 1, minPage + (rangeSize - 1)));

  var pageLinks = totalPages > 2 && [].concat(_toConsumableArray((0, _range2.default)(minPage, maxPage))).map(function (page) {
    var pageLinkClass = (0, _classNames2.default)().withConditional({ current: page === currentPage }).load();

    return _react2.default.createElement(
      'li',
      { className: pageLinkClass, key: page },
      _react2.default.createElement(_PageNumber.PageNumber, _extends({}, props, { page: page }))
    );
  });

  var separator = _react2.default.createElement(
    'li',
    { className: 'skip' },
    _react2.default.createElement('i', { className: 'fa fa-ellipsis-h' })
  );

  var begin = _react2.default.createElement(
    'li',
    { className: (0, _classNames2.default)({ current: currentPage === 1 }) },
    _react2.default.createElement(_PageNumber.PageNumber, _extends({}, props, { page: 1 }))
  );

  var end = totalPages > 1 && _react2.default.createElement(
    'li',
    { className: (0, _classNames2.default)({ current: currentPage === totalPages }) },
    _react2.default.createElement(_PageNumber.PageNumber, _extends({}, props, { page: totalPages }))
  );

  return _react2.default.createElement(
    'ul',
    { className: 'pagination' },
    _react2.default.createElement(
      'li',
      null,
      _react2.default.createElement(_Prev.Prev, props)
    ),
    begin,
    hasLeftEllipsis && separator,
    pageLinks,
    hasRightEllipsis && separator,
    end,
    _react2.default.createElement(
      'li',
      null,
      _react2.default.createElement(_Next.Next, props)
    )
  );
}

Paginator.propTypes = {
  currentPage: _propTypes2.default.number,
  totalPages: _propTypes2.default.number,
  hasPreviousPage: _propTypes2.default.bool,
  hasNextPage: _propTypes2.default.bool
};

exports.default = (0, _paginate2.default)(Paginator);
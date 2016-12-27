'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PageLink = PageLink;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _PaginationWrapper = require('./PaginationWrapper');

var _PaginationWrapper2 = _interopRequireDefault(_PaginationWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function PageLink(_ref) {
  var actions = _ref.actions;
  var page = _ref.page;
  var currentPage = _ref.currentPage;

  var navigate = function navigate() {
    return actions.goTo(page);
  };

  var pageNumber = _react2.default.createElement(
    'span',
    null,
    page
  );
  var link = page === currentPage ? pageNumber : _react2.default.createElement(
    'a',
    { onClick: navigate },
    pageNumber
  );

  return link;
}

exports.default = (0, _PaginationWrapper2.default)(PageLink);
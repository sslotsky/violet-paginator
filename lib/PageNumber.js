'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PageNumber = PageNumber;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _decorators = require('./decorators');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function PageNumber(_ref) {
  var pageActions = _ref.pageActions,
      page = _ref.page,
      currentPage = _ref.currentPage;

  var navigate = function navigate() {
    return pageActions.goTo(page);
  };

  var pageNumber = _react2.default.createElement(
    'span',
    null,
    page
  );
  var link = page === currentPage ? pageNumber : _react2.default.createElement(
    'button',
    { type: 'button', onClick: navigate },
    pageNumber
  );

  return link;
}

PageNumber.propTypes = {
  pageActions: _propTypes2.default.shape({
    goTo: _propTypes2.default.func.isRequired
  }).isRequired,
  page: _propTypes2.default.number.isRequired,
  currentPage: _propTypes2.default.number.isRequired
};

exports.default = (0, _decorators.paginate)(PageNumber);
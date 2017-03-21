'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PageLink = PageLink;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _decorators = require('./decorators');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function PageLink(_ref) {
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

PageLink.propTypes = {
  pageActions: _react.PropTypes.shape({
    goTo: _react.PropTypes.func.isRequired
  }).isRequired,
  page: _react.PropTypes.number.isRequired,
  currentPage: _react.PropTypes.number.isRequired
};

exports.default = (0, _decorators.paginate)(PageLink);
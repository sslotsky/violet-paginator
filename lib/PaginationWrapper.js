'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = paginate;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _actions = require('./actions');

var _actions2 = _interopRequireDefault(_actions);

var _reducer = require('./reducer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var connector = (0, _reactRedux.connect)(function (state, ownProps) {
  return {
    paginator: state.pagination.find(function (p) {
      return p.get('id') === ownProps.listId;
    })
  };
}, function (dispatch, ownProps) {
  return {
    actions: (0, _redux.bindActionCreators)((0, _actions2.default)(ownProps), dispatch)
  };
});

function paginate(ComponentClass) {
  var _class, _temp;

  return connector((_temp = _class = function (_Component) {
    _inherits(_class, _Component);

    function _class() {
      _classCallCheck(this, _class);

      return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
    }

    _createClass(_class, [{
      key: 'reloadIfStale',
      value: function reloadIfStale(props) {
        var paginator = props.paginator;
        var actions = props.actions;

        if (paginator.get('stale') && !paginator.get('isLoading')) {
          actions.reload();
        }
      }
    }, {
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.props.actions.initialize();
        this.reloadIfStale(this.props);
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        this.reloadIfStale(nextProps);
      }
    }, {
      key: 'info',
      value: function info() {
        var paginator = this.props.paginator;

        var totalPages = Math.ceil(paginator.get('totalCount') / paginator.get('pageSize'));

        return {
          hasPreviousPage: paginator.get('page') > 1,
          hasNextPage: paginator.get('page') < totalPages,
          currentPage: paginator.get('page'),
          pageSize: paginator.get('pageSize'),
          results: paginator.get('results'),
          isLoading: paginator.get('isLoading'),
          updating: paginator.get('updating'),
          removing: paginator.get('removing'),
          totalPages: totalPages
        };
      }
    }, {
      key: 'render',
      value: function render() {
        return _react2.default.createElement(ComponentClass, _extends({}, this.props, this.info()));
      }
    }]);

    return _class;
  }(_react.Component), _class.propTypes = {
    actions: _react.PropTypes.object.isRequired,
    paginator: _react.PropTypes.object
  }, _class.defaultProps = {
    paginator: _reducer.defaultPaginator
  }, _temp));
}
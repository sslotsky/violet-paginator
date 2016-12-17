'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.vpActionTypes = exports.currentQuery = exports.isRemoving = exports.isUpdating = exports.getPaginator = exports.configurePageParams = exports.paginate = exports.pagination = exports.PageSizeDropdown = exports.VioletPageSizeDropdown = exports.Next = exports.VioletNext = exports.Prev = exports.VioletPrev = exports.SortLink = exports.VioletSortLink = exports.Paginator = exports.VioletPaginator = exports.Flipper = exports.VioletFlipper = exports.DataTable = exports.VioletDataTable = exports.simpleComposables = exports.expireAll = exports.destroyAll = exports.composables = exports.register = undefined;

var _actions = require('./actions');

Object.defineProperty(exports, 'composables', {
  enumerable: true,
  get: function get() {
    return _actions.composables;
  }
});
Object.defineProperty(exports, 'destroyAll', {
  enumerable: true,
  get: function get() {
    return _actions.destroyAll;
  }
});
Object.defineProperty(exports, 'expireAll', {
  enumerable: true,
  get: function get() {
    return _actions.expireAll;
  }
});

var _DataTable = require('./DataTable');

Object.defineProperty(exports, 'DataTable', {
  enumerable: true,
  get: function get() {
    return _DataTable.DataTable;
  }
});

var _Flipper = require('./Flipper');

Object.defineProperty(exports, 'Flipper', {
  enumerable: true,
  get: function get() {
    return _Flipper.Flipper;
  }
});

var _Paginator = require('./Paginator');

Object.defineProperty(exports, 'Paginator', {
  enumerable: true,
  get: function get() {
    return _Paginator.Paginator;
  }
});

var _SortLink = require('./SortLink');

Object.defineProperty(exports, 'SortLink', {
  enumerable: true,
  get: function get() {
    return _SortLink.SortLink;
  }
});

var _Prev = require('./Prev');

Object.defineProperty(exports, 'Prev', {
  enumerable: true,
  get: function get() {
    return _Prev.Prev;
  }
});

var _Next = require('./Next');

Object.defineProperty(exports, 'Next', {
  enumerable: true,
  get: function get() {
    return _Next.Next;
  }
});

var _PageSizeDropdown = require('./PageSizeDropdown');

Object.defineProperty(exports, 'PageSizeDropdown', {
  enumerable: true,
  get: function get() {
    return _PageSizeDropdown.PageSizeDropdown;
  }
});

var _pageInfoTranslator = require('./pageInfoTranslator');

Object.defineProperty(exports, 'configurePageParams', {
  enumerable: true,
  get: function get() {
    return _pageInfoTranslator.configurePageParams;
  }
});

var _stateManagement = require('./lib/stateManagement');

Object.defineProperty(exports, 'isUpdating', {
  enumerable: true,
  get: function get() {
    return _stateManagement.isUpdating;
  }
});
Object.defineProperty(exports, 'isRemoving', {
  enumerable: true,
  get: function get() {
    return _stateManagement.isRemoving;
  }
});
Object.defineProperty(exports, 'currentQuery', {
  enumerable: true,
  get: function get() {
    return _stateManagement.currentQuery;
  }
});

var _actions2 = _interopRequireDefault(_actions);

var _simpleComposables2 = require('./actions/simpleComposables');

var _simpleComposables3 = _interopRequireDefault(_simpleComposables2);

var _DataTable2 = _interopRequireDefault(_DataTable);

var _Flipper2 = _interopRequireDefault(_Flipper);

var _Paginator2 = _interopRequireDefault(_Paginator);

var _SortLink2 = _interopRequireDefault(_SortLink);

var _Prev2 = _interopRequireDefault(_Prev);

var _Next2 = _interopRequireDefault(_Next);

var _PageSizeDropdown2 = _interopRequireDefault(_PageSizeDropdown);

var _reducer = require('./reducer');

var _reducer2 = _interopRequireDefault(_reducer);

var _PaginationWrapper = require('./PaginationWrapper');

var _PaginationWrapper2 = _interopRequireDefault(_PaginationWrapper);

var _stateManagement2 = _interopRequireDefault(_stateManagement);

var _actionTypes = require('./actionTypes');

var _vpActionTypes = _interopRequireWildcard(_actionTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.register = _actions2.default;
exports.simpleComposables = _simpleComposables3.default;
exports.VioletDataTable = _DataTable2.default;
exports.VioletFlipper = _Flipper2.default;
exports.VioletPaginator = _Paginator2.default;
exports.VioletSortLink = _SortLink2.default;
exports.VioletPrev = _Prev2.default;
exports.VioletNext = _Next2.default;
exports.VioletPageSizeDropdown = _PageSizeDropdown2.default;
exports.pagination = _reducer2.default;
exports.paginate = _PaginationWrapper2.default;
exports.getPaginator = _stateManagement2.default;
exports.vpActionTypes = _vpActionTypes;
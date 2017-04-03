'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = actionType;
var INITIALIZE_PAGINATOR = exports.INITIALIZE_PAGINATOR = '@@paginate-this/INITIALIZE_PAGINATOR';
var EXPIRE_PAGINATOR = exports.EXPIRE_PAGINATOR = '@@paginate-this/EXPIRE_PAGINATOR';
var EXPIRE_ALL = exports.EXPIRE_ALL = '@@paginate-this/EXPIRE_ALL';
var FOUND_PAGINATOR = exports.FOUND_PAGINATOR = '@@paginate-this/FOUND_PAGINATOR';
var PREVIOUS_PAGE = exports.PREVIOUS_PAGE = '@@paginate-this/PREVIOUS_PAGE';
var NEXT_PAGE = exports.NEXT_PAGE = '@@paginate-this/NEXT_PAGE';
var GO_TO_PAGE = exports.GO_TO_PAGE = '@@paginate-this/GO_TO_PAGE';
var SET_PAGE_SIZE = exports.SET_PAGE_SIZE = '@@paginate-this/SET_PAGE_SIZE';
var FETCH_RECORDS = exports.FETCH_RECORDS = '@@paginate-this/FETCH_RECORDS';
var RESULTS_UPDATED = exports.RESULTS_UPDATED = '@@paginate-this/RESULTS_UPDATED';
var RESULTS_UPDATED_ERROR = exports.RESULTS_UPDATED_ERROR = '@@paginate-this/RESULTS_UPDATED_ERROR';
var TOGGLE_FILTER_ITEM = exports.TOGGLE_FILTER_ITEM = '@@paginate-this/TOGGLE_FILTER_ITEM';
var SET_FILTER = exports.SET_FILTER = '@@paginate-this/SET_FILTER';
var SET_FILTERS = exports.SET_FILTERS = '@@paginate-this/SET_FILTERS';
var RESET_FILTERS = exports.RESET_FILTERS = '@@paginate-this/RESET_FILTERS';
var SORT_CHANGED = exports.SORT_CHANGED = '@@paginate-this/SORT_CHANGED';
var UPDATING_ITEM = exports.UPDATING_ITEM = '@@paginate-this/UPDATING_ITEM';
var UPDATE_ITEMS = exports.UPDATE_ITEMS = '@@paginate-this/UPDATE_ITEMS';
var UPDATE_ITEM = exports.UPDATE_ITEM = '@@paginate-this/UPDATE_ITEM';
var UPDATING_ITEMS = exports.UPDATING_ITEMS = '@@paginate-this/UPDATING_ITEMS';
var UPDATE_COMPLETE = exports.UPDATE_COMPLETE = '@@paginate-this/UPDATE_COMPLETE';
var UPDATE_FAILED = exports.UPDATE_FAILED = '@@paginate-this/UPDATE_FAILED';
var MASS_UPDATE_COMPLETE = exports.MASS_UPDATE_COMPLETE = '@@paginate-this/MASS_UPDATE_COMPLETE';
var MASS_UPDATE_FAILED = exports.MASS_UPDATE_FAILED = '@@paginate-this/MASS_UPDATE_FAILED';
var RESET_ITEM = exports.RESET_ITEM = '@@paginate-this/RESET_ITEM';
var MARK_ITEMS_ERRORED = exports.MARK_ITEMS_ERRORED = '@@paginate-this/MARK_ITEMS_ERRORED';
var RESET_RESULTS = exports.RESET_RESULTS = '@@paginate-this/RESET_RESULTS';
var REMOVING_ITEM = exports.REMOVING_ITEM = '@@paginate-this/REMOVING_ITEM';
var REMOVE_ITEM = exports.REMOVE_ITEM = '@@paginate-this/REMOVE_ITEM';
var ITEM_ERROR = exports.ITEM_ERROR = '@@paginate-this/ITEM_ERROR';

function actionType(t, id) {
  return t + '_' + id;
}
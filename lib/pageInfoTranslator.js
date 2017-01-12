'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.responseProps = responseProps;
exports.recordProps = recordProps;
exports.configurePageParams = configurePageParams;
exports.translate = translate;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var pageParam = 'page';
var pageSizeParam = 'pageSize';
var sortParam = 'sort';
var sortOrderParam = 'sortOrder';
var useBooleanOrdering = false;
var totalCountProp = 'total_count';
var resultsProp = 'results';
var idProp = 'id';
function responseProps() {
  return [totalCountProp, resultsProp];
}

function recordProps() {
  return { identifier: idProp };
}

function configurePageParams(_ref) {
  var page = _ref.page;
  var perPage = _ref.perPage;
  var sort = _ref.sort;
  var sortOrder = _ref.sortOrder;
  var sortReverse = _ref.sortReverse;
  var totalCount = _ref.totalCount;
  var results = _ref.results;
  var id = _ref.id;

  if (page) {
    pageParam = page;
  }

  if (perPage) {
    pageSizeParam = perPage;
  }

  if (sort) {
    sortParam = sort;
  }

  if (sortOrder) {
    sortOrderParam = sortOrder;
  }

  if (totalCount) {
    totalCountProp = totalCount;
  }

  if (results) {
    resultsProp = results;
  }

  if (id) {
    idProp = id;
  }

  useBooleanOrdering = !!sortReverse;
}

function sortDirection(value) {
  if (useBooleanOrdering) {
    return value;
  }

  return value ? 'desc' : 'asc';
}

function sortParams(paginator) {
  if (paginator.get('sort')) {
    var _ref2;

    return _ref2 = {}, _defineProperty(_ref2, sortParam, paginator.get('sort')), _defineProperty(_ref2, sortOrderParam, sortDirection(paginator.get('sortReverse'))), _ref2;
  }

  return {};
}

function translate(paginator) {
  var _extends2;

  var _paginator$toJS = paginator.toJS();

  var id = _paginator$toJS.id;
  var page = _paginator$toJS.page;
  var pageSize = _paginator$toJS.pageSize;
  var filters = _paginator$toJS.filters;


  return {
    id: id,
    query: _extends((_extends2 = {}, _defineProperty(_extends2, pageParam, page), _defineProperty(_extends2, pageSizeParam, pageSize), _extends2), sortParams(paginator), filters)
  };
}
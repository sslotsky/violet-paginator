'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getPaginator;
exports.preloadedPaginator = preloadedPaginator;
exports.isUpdating = isUpdating;
exports.isRemoving = isRemoving;
exports.currentQuery = currentQuery;

var _reducer = require('../reducer');

var _pageInfoTranslator = require('../pageInfoTranslator');

function getPaginator(state, listId) {
  return state.pagination.find(function (p) {
    return p.get('id') === listId;
  }, undefined, _reducer.defaultPaginator);
}

var preload = { results: [] };

function preloadedPaginator(state, listId) {
  var preloaded = arguments.length <= 2 || arguments[2] === undefined ? preload : arguments[2];

  var paginator = getPaginator(state, listId);
  return paginator.equals(_reducer.defaultPaginator) ? paginator.merge(preloaded) : paginator;
}

function isUpdating(state, listId, itemId) {
  var paginator = getPaginator(state, listId);
  return paginator.get('updating').includes(itemId);
}

function isRemoving(state, listId, itemId) {
  var paginator = getPaginator(state, listId);
  return paginator.get('removing').includes(itemId);
}

function currentQuery(state, listId) {
  return (0, _pageInfoTranslator.translate)(getPaginator(state, listId));
}
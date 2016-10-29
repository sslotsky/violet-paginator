'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getPaginator;
exports.isUpdating = isUpdating;
exports.isRemoving = isRemoving;

var _reducer = require('../reducer');

function getPaginator(state, listId) {
  return state.pagination.find(function (p) {
    return p.get('id') === listId;
  }, undefined, _reducer.defaultPaginator);
}

function isUpdating(state, listId, itemId) {
  var paginator = getPaginator(state, listId);
  return paginator.get('updating').includes(itemId) || paginator.get('bulkUpdating');
}

function isRemoving(state, listId, itemId) {
  var paginator = getPaginator(state, listId);
  return paginator.get('removing').includes(itemId);
}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getPaginator;

var _reducer = require('../reducer');

function getPaginator(state, listId) {
  return state.pagination.find(function (p) {
    return p.get('id') === listId;
  }, undefined, _reducer.defaultPaginator);
}
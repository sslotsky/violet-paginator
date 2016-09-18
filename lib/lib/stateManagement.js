'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getPaginator;

var _immutable = require('immutable');

function getPaginator(state, listId) {
  return state.pagination.find(function (p) {
    return p.get('id') === listId;
  }, undefined, (0, _immutable.Map)());
}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveAll = resolveAll;
exports.resolveEach = resolveEach;
exports.updateListItem = updateListItem;
function resolveAll(initialState, register) {
  return function resolve() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
    var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var handlers = arguments.length <= 2 || arguments[2] === undefined ? register(state, action) : arguments[2];

    return handlers[action.type] ? handlers[action.type]() : state;
  };
}

function resolveEach(initialState, handlers) {
  return function resolve() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
    var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    return handlers[action.type] ? handlers[action.type](state, action) : state;
  };
}

function updateListItem(list, id, update) {
  var identifier = arguments.length <= 3 || arguments[3] === undefined ? 'id' : arguments[3];

  return list.map(function (i) {
    if (i.get(identifier) === id) {
      return update(i);
    }

    return i;
  });
}
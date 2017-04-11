'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateListItem = updateListItem;
exports.resolveEach = resolveEach;
function updateListItem(list, id, update) {
  var identifier = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'id';

  return list.map(function (i) {
    if (i.get(identifier) === id) {
      return update(i);
    }

    return i;
  });
}

function resolveEach(initialState, handlers) {
  return function resolve() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return handlers[action.type] ? handlers[action.type](state, action) : state;
  };
}
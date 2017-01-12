'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateListItem = updateListItem;
function updateListItem(list, id, update) {
  var identifier = arguments.length <= 3 || arguments[3] === undefined ? 'id' : arguments[3];

  return list.map(function (i) {
    if (i.get(identifier) === id) {
      return update(i);
    }

    return i;
  });
}
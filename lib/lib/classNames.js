'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = classNames;
function classNames() {
  for (var _len = arguments.length, names = Array(_len), _key = 0; _key < _len; _key++) {
    names[_key] = arguments[_key];
  }

  var classes = names;

  var builder = {
    load: function load() {
      return classes.join(' ');
    }
  };

  builder.withConditional = function (map) {
    Object.keys(map).forEach(function (k) {
      if (map[k] && !classes.includes(k)) {
        classes.push(k);
      }
    });

    return builder;
  };

  return builder;
}
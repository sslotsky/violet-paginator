'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (store) {
  return function (next) {
    return function (action) {
      if (typeof action === 'function') {
        return action(store.dispatch, store.getState);
      }

      return next(action);
    };
  };
};
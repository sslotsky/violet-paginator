'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = resolveActions;

var _flux = require('./flux');

function resolveActions(props, actionSelect) {
  if (typeof actionSelect === 'function') {
    return actionSelect((0, _flux.getFlux)().dispatch, props);
  }

  return (0, _flux.bindActions)(actionSelect);
}
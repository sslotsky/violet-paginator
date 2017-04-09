'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = withRecordProps;

var _flux = require('../flux/flux');

var _stateManagement = require('../lib/stateManagement');

function withRecordProps(Component) {
  return (0, _flux.getFlux)().decorate(function (state, ownProps) {
    var listId = ownProps.listId,
        itemId = ownProps.itemId;


    return {
      record: (0, _stateManagement.getItem)(state, listId, itemId).toJS(),
      updating: (0, _stateManagement.isUpdating)(state, listId, itemId),
      removing: (0, _stateManagement.isRemoving)(state, listId, itemId)
    };
  })(Component);
}
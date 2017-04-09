import { getFlux, bindActions } from './flux'

export default function resolveActions(props, actionSelect) {
  if (typeof (actionSelect) === 'function') {
    return actionSelect(getFlux().dispatch, props)
  }

  return bindActions(actionSelect)
}


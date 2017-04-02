import { getFlux } from '../flux/flux'
import { getItem, isUpdating, isRemoving } from '../lib/stateManagement'

const flux = getFlux()

export default function withRecordProps(Component) {
  return flux.decorate(
    (state, ownProps) => {
      const { listId, itemId } = ownProps

      return {
        record: getItem(state, listId, itemId).toJS(),
        updating: isUpdating(state, listId, itemId),
        removing: isRemoving(state, listId, itemId)
      }
    }
  )(Component)
}

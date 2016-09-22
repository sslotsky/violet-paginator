import * as actionTypes from './actionTypes'
import { recordProps } from './pageInfoTranslator'
import getPaginator from './lib/stateManagement'
import simpleComposables from './actions/simpleComposables'
import fetchingComposables from './actions/fetchingComposables'

const { identifier } = recordProps()

export function destroyAll() {
  return {
    type: actionTypes.DESTROY_ALL
  }
}

export function expireAll() {
  return {
    type: actionTypes.EXPIRE_ALL
  }
}

export default function register(config) {
  const simple = simpleComposables(config.listId)
  const updateAsync = (id, data, update) =>
    (dispatch, getState) => {
      const item = getPaginator(getState(), config.listId).get('results')
        .find(r => r.get(identifier) === id)

      dispatch(simple.updateItem(id, data))
      dispatch(simple.updatingItem(id))
      return update().then(serverUpdate =>
        dispatch(simple.updateItem(id, serverUpdate))
      ).catch(err => {
        dispatch(simple.updateItem(id, item.toJS()))
        return dispatch(simple.itemError(id, err))
      })
    }

  return {
    ...fetchingComposables(config),
    ...simpleComposables(config.listId),
    updateAsync
  }
}

export function composables(config) {
  return register({
    ...config,
    isBoundToDispatch: false
  })
}

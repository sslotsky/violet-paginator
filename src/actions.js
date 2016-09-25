import * as actionTypes from './actionTypes'
import simpleComposables from './actions/simpleComposables'
import fetchingComposables from './actions/fetchingComposables'


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
  return {
    ...fetchingComposables(config),
    ...simpleComposables(config.listId)
  }
}

export function composables(config) {
  return register({
    ...config,
    isBoundToDispatch: false
  })
}

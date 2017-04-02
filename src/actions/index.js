import * as actionTypes from './actionTypes'
import simpleComposables from './simpleComposables'
import fetchingComposables from './fetchingComposables'
import { bindActions } from '../flux'

export function expireAll() {
  return {
    type: actionTypes.EXPIRE_ALL
  }
}

export default function composables(config) {
  return {
    ...fetchingComposables(config),
    ...simpleComposables(config.listId)
  }
}

export function actionFactory(listId) {
  return bindActions(composables({ listId }))
}

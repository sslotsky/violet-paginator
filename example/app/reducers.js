import { i18nReducer } from 'react-redux-i18n'
import { combineReducers } from 'redux'
import { pagination } from 'violet-paginator'
import recipes from './recipes/reducer'

export default combineReducers({
  recipes,
  pagination,
  i18n: i18nReducer
})

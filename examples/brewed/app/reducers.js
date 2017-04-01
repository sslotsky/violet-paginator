import { i18nReducer } from 'react-redux-i18n'
import { combineReducers } from 'redux'
import { paginate } from 'violet-paginator'
import recipes from './recipes/reducer'
import fetch from './recipes/actions'

paginate({
  listId: 'recipeGrid',
  fetch
})

export default combineReducers({
  recipes,
  i18n: i18nReducer
})

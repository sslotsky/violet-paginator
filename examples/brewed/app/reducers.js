import { combineReducers } from 'redux'
import { paginate } from '@orange-marmalade/paginate-this'
import fetch from './recipes/actions'

paginate({
  listId: 'recipeGrid',
  fetch
})

export default combineReducers({})

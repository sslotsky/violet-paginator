import api from 'ROOT/api'
import * as actionTypes from './actionTypes'
import { actionFactory } from '@orange-marmalade/paginate-this'

const pageActions = actionFactory('recipeGrid')

export default function fetchRecipes(pageInfo) {
  return () => api.recipes.index(pageInfo.query)
}

export function toggleActive(recipe) {
  const data = { active: !recipe.active }
  const update = new Promise((resolve) => {
    setTimeout(resolve, 1500)
  })

  return pageActions.updateAsync(recipe.id, data, update)
}

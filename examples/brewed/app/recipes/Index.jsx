import React from 'react'
import {
  Flipper,
  DataTable,
  Paginator,
  PageSizeDropdown
} from '@orange-marmalade/paginate-this'
import { connect } from 'react-redux'
import * as actions from './actions'

const headers = (toggle) => [{
  field: 'name',
  text: 'Name'
}, {
  field: 'created_at',
  text: 'Created At'
}, {
  field: 'boil_time',
  sortable: false,
  text: 'Boil Time'
}, {
  field: 'active',
  sortable: false,
  text: 'Active?',
  format: recipe => (
    <input
      type="checkbox"
      checked={!!recipe.active}
      onChange={() => toggle(recipe)}
    />
  )
}]

export function Index({ toggle }) {
  const flipper = (
    <Flipper listId="recipeGrid" />
  )

  return (
    <section>
      <PageSizeDropdown listId="recipeGrid" />
      <Paginator listId="recipeGrid"  />
      {flipper}
      <DataTable listId="recipeGrid" headers={headers(toggle)} />
      {flipper}
      <Paginator listId="recipeGrid" />
    </section>
  )
}

export default props => <Index {...props} toggle={actions.toggleActive} />;

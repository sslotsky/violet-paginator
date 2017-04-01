import React, { PropTypes, Component } from 'react'
import {
  VioletFlipper,
  VioletDataTable,
  VioletPaginator,
  VioletPageSizeDropdown
} from 'violet-paginator'
import { Link } from 'react-router'

export default class Index extends Component {
  nameColumn(recipe) {
    return (
      <Link to={`/recipes/${recipe.get('id')}`}>
        {recipe.get('name')}
      </Link>
    )
  }

  headers() {
    return [{
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
          onChange={() => {}/*this.props.toggle(recipe)}*/}
        />
      )
    }]
  }

  render() {
    const flipper = (
      <VioletFlipper listId="recipeGrid" />
    )

    return (
      <section>
        <VioletPageSizeDropdown listId="recipeGrid" />
        <VioletPaginator listId="recipeGrid"  />
        {flipper}
        <VioletDataTable listId="recipeGrid" headers={this.headers()} />
        {flipper}
        <VioletPaginator listId="recipeGrid" />
      </section>
    )
  }
}

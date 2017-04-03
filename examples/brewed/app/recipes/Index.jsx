import React, { PropTypes, Component } from 'react'
import {
  Flipper,
  DataTable,
  Paginator,
  PageSizeDropdown
} from '@orange-marmalade/paginate-this'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import * as actions from './actions'

export class Index extends Component {
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
          onChange={() =>this.props.toggle(recipe)}
        />
      )
    }]
  }

  render() {
    const flipper = (
      <Flipper listId="recipeGrid" />
    )

    return (
      <section>
        <PageSizeDropdown listId="recipeGrid" />
        <Paginator listId="recipeGrid"  />
        {flipper}
        <DataTable listId="recipeGrid" headers={this.headers()} />
        {flipper}
        <Paginator listId="recipeGrid" />
      </section>
    )
  }
}

export default connect(undefined, { toggle: actions.toggleActive })(Index)

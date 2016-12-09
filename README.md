[![npm](https://img.shields.io/npm/v/violet-paginator.svg)](https://github.com/sslotsky/violet-paginator)
[![npm](https://img.shields.io/npm/dt/violet-paginator.svg)](https://www.npmjs.com/package/violet-paginator)
[![npm](https://img.shields.io/npm/dm/violet-paginator.svg)](https://www.npmjs.com/package/violet-paginator)
[![Build Status](https://travis-ci.org/sslotsky/violet-paginator.svg?branch=master)](https://travis-ci.org/sslotsky/violet-paginator)
[![codecov](https://codecov.io/gh/sslotsky/violet-paginator/branch/master/graph/badge.svg)](https://codecov.io/gh/sslotsky/violet-paginator)
[![npm](https://img.shields.io/npm/l/express.svg)](https://github.com/sslotsky/violet-paginator)

# violet-paginator

VioletPaginator is a react-redux package allowing users to manage arbitrarily many filtered, paginated lists
of records. We provide a set of premade components including both simple and robust pagination controls,
sort links, and data tables. We also make it ridiculously easy to write your own components and configure
and extend VioletPaginator's default behavior by composing actions.

## Demo

https://sslotsky.github.io/violet-paginator/

## Extended Documentation

https://sslotsky.gitbooks.io/violet-paginator/content/

## Installation

```
npm i --save violet-paginator
```

### Dependencies

The current version of this package includes the following peer dependencies:

```javascript
  "peerDependencies": {
    "immutable": "^3.7.6",
    "react": "^0.14.8 || ^15.1.0",
    "react-redux": "^4.4.4",
    "redux": "^3.4.0"
  },
```

Additionally, it is assumed that you are running some middleware that allows action creators to return
promises, such as [redux-thunk](https://github.com/gaearon/redux-thunk).

Finally, if you wish to use the premade `VioletPaginator` components, it is recommended that you include the `violet`
and `font-awesome` stylesheets as described later in this document.

## Usage

`VioletPaginator` is intended to be flexible so that it can be used in many ways without much fuss. We provide premade components, but our library is broken down into small, exposed pieces that allow you to easily override default settings, abstract core functionality, and create your own components.

### Mounting the reducer

As with many redux based packages, `violet-paginator` comes with a reducer that must be imported and added to your state via `combineReducers`:

```javascript
import { pagination } from 'violet-paginator'
import { combineReducers } from 'redux'
import users from './users/reducer'

export default combineReducers({
  users,
  pagination
})
```

### Configuration

VioletPaginator aims to make client-server communication painless. For us, usability means:

1. We know how to read data from your server.
2. We will provide you with the _correctly formatted_ parameters that you need to send to your server.

Because different backends will use different property names for pagination and sorting, we make this 
fully configurable. Example config:

```javascript
import { configurePageParams } from 'violet-paginator'

configurePageParams({
  perPage: 'results_per_page',
  sortOrder: 'sort_reverse',
  sortReverse: true // Means that a boolean will be used to indicate sort direction.
})

```

An example URL with this configuration:

```
https://brewed-dev.herokuapp.com/v1/recipes?page=6&results_per_page=15&sort=name&sort_reverse=true
```

Another example config:

```javascript
configurePageParams({
  perPage: 'page_size',
  sortOrder: 'direction'
})
```

And a corresponding example URL:

```
https://www.example.com/v1/users?page=6&page_size=15&sort=name&direction=asc
```

The complete list of configuration options and their defaults can be found in the [pageInfoTranslator](https://github.com/sslotsky/violet-paginator/blob/master/src/pageInfoTranslator.js):

Property Name | Default Value | Description
---|:---:|:---
page | `'page'` | The page number being requested
perPage | `'pageSize'` | The page size being requested
sort | `'sort'` | The field to sort by when requesting a page
sortOrder | `'sortOrder'` | The sort direction for the requested page
sortReverse | `false` | Use a boolean to indicate sort direction
totalCount | `'total_count'` | The name of the property on the server response that indicates total record count
results | `'results'` | The name of the property on the server that contains the page of results
id | `'id'` | The name of the property on the record to be used as the unique identifer

### Using Premade VioletPaginator Components

The following will display a 3 column data table with full pagination controls above and below the table.
All pagination components require the `listId` prop as well as a `fetch` function that is used to retrieve records.
The supplied `fetch` function will be called by the paginator the first time that a component with that
`listId` initializes and every time a pagination action is dispatched, so you never need to call it yourself.
The `VioletDataTable` component also takes an array of headers.

```javascript
import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { VioletDataTable, VioletPaginator } from 'violet-paginator'

import fetchRecipes from './actions'

export class Index extends Component {
  static propTypes = {
    fetch: PropTypes.func.isRequired
  }

  headers() {
    return [{
      field: 'name',
      text: 'Name'
    }, {
      field: 'created_at',
      text: 'Date Created'
    }, {
      field: 'boil_time',
      sortable: false,
      text: 'Boil Time'
    }]
  }

  render() {
    const { fetch } = this.props
    const paginator = (
      <VioletPaginator listId="recipes" fetch={fetch} />
    )

    return (
      <section>
        {paginator}
        <VioletDataTable listId="recipes" fetch={fetch} headers={this.headers()} />
        {paginator}
      </section>
    )
  }
}

export default connect(
  () => ({}),
  { fetch: fetchRecipes }
)(Index)
```

The `fetch` function that you supply to the paginator is an action creator that returns a promise. Therefore,
while [redux-thunk](https://github.com/gaearon/redux-thunk) isn't explicitly required as a peer dependency, you will need to have some such middleware
hooked up that allows action creators to return promises. Below is an example fetch function.

```javascript
export default function fetchRecipes(pageInfo) {
  return () => api.recipes.index(pageInfo.query);
}
```

Unlike most asynchronous action creators, notice that ours has no success and error handlers. `VioletPaginator` has its own
handlers, so supplying your own is not necessary. However, if you wish to handle the response before passing it along to 
`VioletPaginator`, this isn't a problem as long as your success handler returns the response and your failure handler re-throws
for us to catch, like below.

```javascript
export default function fetchRecipes(pageInfo) {
  return dispatch => {
    dispatch({ type: actionTypes.FETCH_RECIPES })
    return api.recipes.index(pageInfo.query).then(resp => {
      dispatch({ type: actionTypes.FETCH_RECIPES_SUCCESS, ...resp.data })
      return resp
    }).catch(error => {
      dispatch({ type: actionTypes.FETCH_RECIPES_ERROR, error })
      throw error
    })
  }
}
```

#### Styling

Our premade components were built to be dispalyed using the [Violet CSS framework](https://github.com/kkestell/violet)
and [Font Awesome](http://fontawesome.io/). We don't expose these stylesheets from our package. We leave it to you to
include those in your project however you see fit. The easiest way is with CDN links:

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Work+Sans:400,500">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/violet/0.0.1/violet.min.css">
```

If Violet isn't for you but you still want to use our components, just write your own CSS. Our components
use very few CSS classess, since Violet CSS rules are mostly structural in nature. However, we do recommend
keeping the font-awesome link for displaying the icons.

### Customizing VioletDataTable

By default, the `VioletDataTable` will simply display the raw values from the data that correspond to the headers that
are specified. However, each header can be supplied with a `format` function, which can return a simple value, some markup,
or a full-fledged react component. Example:

```javascript
  activeColumn(recipe) {
    const icon = recipe.get('active') ? 'check' : 'ban'
    return (
      <FontAwesome name={icon} />
    )
  }

  headers() {
    return [{
      field: 'active',
      sortable: false,
      text: 'Active',
      format: (recipe) => this.activeColumn(recipe)
    }]
  }
```

### Composing Actions

`violet-paginator` is a plugin for redux apps, and as such, it dispatches its own actions and stores state in its own reducer. To give you complete control of the pagination state, the API provides access to all of these actions via the [composables](composables.md) and [simpleComposables](simplecomposables.md) functions. This allows you the flexibility to call them directly as part of a more complex operation. The most common use case for this would be [updating an item within the list](updating_items.md). 

As an example, consider a datatable where one column has a checkbox that's supposed to mark an item as active or inactive. Assuming that you have a `listId` of `'recipes'`, you could write an action creator like this to toggle the active state of a recipe within the list:

```javascript
import { simpleComposables } from 'violet-paginator'

const pageActions = simpleComposables('recipes')

export function toggleActive(recipe) {
  return pageActions.updateItem(
    recipe.get('id'),
    { active: !recipe.get('active') }
  )
}
```

Now you can bring this action creator into your connected component using `connect` and `mapDispatchToProps`:

```javascript
export default connect(
  () => ({}),
  { fetch: fetchRecipes, toggle: toggleActive }
)(Recipes)
```

Finally, the `format` function for the `active` column in your data table might look like this:

```javascript
  activeColumn(recipe) {
    return (
      <input
        type="checkbox"
        checked={!!recipe.get('active')}
        onClick={() => this.props.toggle(recipe)}
      />
    )
  }
```

### Building Custom Components

We understand that every product team could potentially want something different, and our premade components sometimes just won't fit that mold. We want to make it painless
to write your own components, so to accomplish that, we made sure that it was every bit as painless to write ours. The best way to see how to build a custom component
is to look at some of the simpler premade components. For example, here's a link that retrieves the next page of records:

```javascript
import React from 'react'
import FontAwesome from 'react-fontawesome'
import paginate from './PaginationWrapper'

export function Next({ actions, hasNextPage }) {
  const next = <FontAwesome name="chevron-right" />
  const link = hasNextPage ? (
    <a onClick={actions.next}>{next}</a>
  ) : next

  return link
}

export default paginate(Next)
```

And here's a link that can sort our list in either direction by a given field name:

```javascript
import React, { PropTypes } from 'react'
import FontAwesome from 'react-fontawesome'
import paginate from './PaginationWrapper'

export function SortLink({ paginator, actions, field, text, sortable=true }) {
  if (!sortable) {
    return <span>{text}</span>
  }

  const sort = () =>
    actions.sort(field, !paginator.get('sortReverse'))

  const arrow = paginator.get('sort') === field && (
    paginator.get('sortReverse') ? 'angle-up' : 'angle-down'
  )

  return (
    <a onClick={sort}>
      {text} <FontAwesome name={arrow || ''} />
    </a>
  )
}

SortLink.propTypes = {
  paginator: PropTypes.object,
  actions: PropTypes.object,
  field: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  sortable: PropTypes.bool
}

export default paginate(SortLink)
```

These components are simple and small enough to be written as pure functions rather than classes, and you should be able
to accomplish the same. As you might have guessed, we expose the `paginate` function that's being called as the default export
for our components, and that `paginate` function returns a higher order component that injects every property that your component
could possibly need in order to read and update pagination state. The only props that callers need to supply to these components are
a `listId` and a `fetchFunction`, and one or two additional props in some cases. Simply import it into your custom component:

```javascript
import { paginate } from 'violet-paginator'
```

and you are ready to roll your own.

## Contributing

If you wish to contribute, please create a fork and submit a pull request, which will be reviewed as soon as humanly possible. A couple of
key points:

1. Don't check in any changes to the `lib` folder. When we are ready to publish a new version, we will do a build and commit the `lib` changes and the new version number.
2. Add tests for your feature, and make sure all existing tests still pass and that the code passes lint (described further below).

### Testing

This package is tested with mocha. The project uses CI through Travis which includes running tests and linting. Please make sure to write tests for any new pull requests.

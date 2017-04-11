[![npm](https://img.shields.io/npm/v/@orange-marmalade/paginate-this.svg?style=plastic)](https://www.npmjs.com/package/@orange-marmalade/paginate-this)
[![Travis branch](https://img.shields.io/travis/orange-marmalade/paginate-this/paginate-this.svg?style=plastic)](https://travis-ci.org/orange-marmalade/paginate-this)
[![Codecov](https://img.shields.io/codecov/c/github/orange-marmalade/paginate-this.svg?style=plastic)](https://codecov.io/gh/orange-marmalade/paginate-this)
[![license](https://img.shields.io/github/license/orange-marmalade/paginate-this.svg?style=plastic)](https://github.com/orange-marmalade/paginate-this/blob/paginate-this/LICENSE.md)
[![David](https://img.shields.io/david/orange-marmalade/paginate-this.svg?style=plastic)](https://david-dm.org/orange-marmalade/paginate-this)
[![David](https://img.shields.io/david/dev/orange-marmalade/paginate-this.svg?style=plastic)](https://david-dm.org/orange-marmalade/paginate-this?type=dev)

![christopher-walken-does-your-mother-paginate-tell-her-to-paginate-this](https://cloud.githubusercontent.com/assets/374078/24636565/c27b9134-18a0-11e7-885d-39d97f7ff546.jpg)

# paginate-this

This is a complete list management library for React. You can manage as many lists as you want simultaneously.
Here are a few of the things you can do to a list with `paginate-this`:

1. Paginate
2. Sort
3. Filter
4. Update individual items
5. Remove items
6. Share state across different components

We provide a set of premade components including both simple and robust pagination controls,
sort links, and data tables. We also make it ridiculously easy to write your own components and configure
and extend default behavior by composing actions.

## Demo

http://daffy-teeth.surge.sh/

## Extended Documentation

## Installation

```
npm i --save @orange-marmalade/paginate-this
```

## Dependencies

The current version of this package includes the following peer dependencies:

```javascript
  "peerDependencies": {
    "immutable": "^3.7.6",
    "react": "^0.14.8 || ^15.1.0"
  },
```

Additionally, if you are using the premade `paginate-this` components, you'll want to include the `font-awesome` stylesheet
as described later in this document.

## Example Usage

A minimal example:

```javascript
import React from 'react'
import { initializeStore, paginate, Paginator, DataTable } from 'paginate-this'
import api from 'ROOT/api'

function fetchRecipes(pageInfo) {
  return () => api.recipes.index(pageInfo.query)
}

initializeStore()
paginate({ listId: 'recipeGrid', fetch: fetchRecipes })

const headers = {
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
  }]
}

export default function Recipes() {
  return (
    <section>
      <Paginator listId="recipeGrid"  />
      <DataTable listId="recipeGrid" headers={headers} />
    </section>
  )
}
```

Read on for details, including how to make sure that the example above will work for your [API settings](#api-settings).

## Detailed Usage

`paginate-this` is intended to be flexible so that it can be used in many ways without much fuss. We provide premade components,
but our library is broken down into small, exposed pieces that allow you to easily override default settings, abstract core functionality, and create your own components.
We also allow easy integration with [redux](https://www.npmjs.com/package/redux).

At a high level, setting up `paginate-this` involves the following steps:

1. Tell us about your [API Settings](#api-settings)
2. Tell us about the [list you're managing](#declaring-a-list)
3. Render components, whether premade or custom

### API Settings

The URL's we choose to fetch data from the server can look quite different from each other. Your API might use URL's that look like this:

```
https://www.example.com/v1/users?page=6&page_size=15&sort=name&direction=asc
```

Or, they might look like this:

```
https://www.example.com/v1/users?page=6&limit=25&sort=name&reverse=true
```

Fortunately, `paginate-this` does not discriminate. You can tell us about your API conventions, and we will follow them:

```javascript
import { configurePageParams } from 'paginate-this'

configurePageParams({
  perPage: 'results_per_page',
  sortOrder: 'sort_reverse',
  sortReverse: true // Means that a boolean will be used to indicate sort direction.
})

```

For more details on this, see the [configuration](#configuration) section.

### Standalone Setup (no redux)

When `paginate-this` was `violet-paginator`, it was built to be used with [redux](https://www.npmjs.com/package/redux).
Since then, it's been refactored to work just fine without it. We do this by maintaining or own data store and one-way-data-flow
with a design that's modeled after `redux`. We still think that `redux` will help you get the most out of `paginate-this`, but
a major goal of this rewrite was to reduce depenendencies, and decoupling from `redux` was a major step in that direction.

#### Declaring a list

Tell us about your list. It needs a unique identifier, and a function that fetches data from the server:

```javascript
import { paginate } from 'paginate-this'
import api from 'ROOT/api'

function fetchRecipes(pageInfo) {
  return () => api.recipes.index(pageInfo.query)
}

paginate({ listId: 'recipeGrid', fetch: fetchRecipes })
```

By using the `paginate` function, you are telling `paginate-this` to manage the list in its internal data store.

The `paginate` function also allows many additional configuration options, which you can read about [here](#TBD).

#### Initializing the store

Before you can render components or fire off some actions, call `initializeStore()` so that `paginate-this` can prepare
its data store:

```javascript
import { initializeStore } from '@orange-marmalade/paginate-this'

initializeStore()
```

#### Optional debugging

Calling `debug()` before initializing the store signals `paginate-this` to print useful info to the console.

```javascript
import { initializeStore, debug } from '@orange-marmalade/paginate-this'

debug(process.env.NODE_ENV === 'development')
initializeStore()
```

### Redux setup

Integrating `paginate-this` with `redux` is easy, and the setup is almost identical to the standalone setup.

#### Creating a reducer

This is similar to [declaring a list](#declaring-a-list) in the standalone setup, with one difference: instead of the `paginate` function,
you'll use `createPaginator`, which will return a reducer for you to add to your store.

```javascript
import { createPaginator } from 'paginate-this'
import { combineReducers } from 'redux'
import users from './users/reducer'
import { fetch } from './recipes/actions'

export default combineReducers({
  users,
  recipes: createPaginator({
    listId: 'recipes',
    fetch
  })
})
```

The `createPaginator` function allows the same additional configuration options as `paginate`, which you can read about [here](#TBD).

#### Async middleware

If you already use [redux-thunk](https://www.npmjs.com/package/redux-thunk), you're good to go. If for any reason you don't want the additional
dependency, we provide a virtually identical piece of middleware called `jelly`, which you'll need to add with the `applyMiddleware` function
from `redux`:

```javascript
import { createStore, applyMiddleware } from 'redux'
import { middleware } from 'paginate-this'

import reducers from './reducers'

const store = createStore(reducers, applyMiddleware(middleware.jelly))
```

#### Injecting the redux store

Last step. In order to let `redux` communicate with `paginate` this, we need three essential pieces of the `redux` store, which you provide with
the `initializeStore` function. All together now (with a little bell on it):

```javascript
import { compose, createStore, applyMiddleware } from 'redux'
import { initializeStore, configurePageParams, middleware } from 'paginate-this'

import reducers from './reducers'

const devtools = window.devToolsExtension ? window.devToolsExtension() : f => f

const store = createStore(
  reducers,
  compose(applyMiddleware(middleware.jelly), devtools)
)

configurePageParams({
  perPage: 'results_per_page',
  sortOrder: 'sort_reverse',
  sortReverse: true
})

initializeStore(store)
```

#### Optional logging middleware

We expose another piece of middleware called `spill` which prints useful info to the console. This is the same middleware that runs in standalone
mode when using [`debug(true)`](#optional-debugging).

```javascript
import { createStore, applyMiddleware } from 'redux'
import { initializeStore, middleware } from '@orange-marmalade/paginate-this'

import reducers from './reducers'

const store = createStore(
  reducers,
  applyMiddleware(middleware.jelly, middleware.spill)
)

initializeStore(store)
```

This prints the action and resulting state to the console similar to [redux-devtools](https://github.com/gaearon/redux-devtools), which we recommend
using instead of `spill` if you're setting up `paginate-this` in `redux` mode.

### Rendering components

The component API is the same whether using `redux` or not. All components require a `listId` property
in order to find your list within the store. Some require additional props. Examples:

```javascript
import React from 'react'
import { Paginator, DataTable } from 'paginate-this'

const headers = {
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
  }]
}

export default function Recipes() {
  return (
    <section>
      <Paginator listId="recipeGrid"  />
      <DataTable listId="recipeGrid" headers={headers} />
    </section>
  )
}
```

### Configuration

`paginate-this` aims to make client-server communication painless. For us, usability means:

1. We know how to read data from your server.
2. We will provide you with the _correctly formatted_ parameters that you need to send to your server.

Because different backends will use different property names for pagination and sorting, we make this 
fully configurable. Example config:

```javascript
import { configurePageParams } from 'paginate-this'

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

The complete list of configuration options and their defaults can be found in the [pageInfoTranslator](#tbd):

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

### Styling

No default styling is provided for these components. The markup is simple and very few css classes are used, so styling
in your favorite framework should be simple. In some cases, we do make use of classes from [Font Awesome](http://fontawesome.io/).
You can include this stylesheet in any way you wish, or you can choose to style the classes yourself.

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
```

### Customizing the DataTable component

By default, the `DataTable` will simply display the raw values from the data that correspond to the headers that
are specified. However, each header can be supplied with a `format` function, which can return a simple value, some markup,
or a full-fledged react component. Example:

```javascript
  const activeColumn = recipe => {
    const icon = recipe.active ? 'check' : 'ban'
    return (
      <FontAwesome name={icon} />
    )
  }

  const headers = [{
    field: 'active',
    sortable: false,
    text: 'Active',
    format: activeColumn
  }, {
    ...
  }]
```

### Advanced usage

What you've read up until now gives you everything you need to sort, filter, and paginate records using our premade components. The following
sections demonstrate more advanced usage of `paginate-this`, focusing on two main areas:

1. *Inline updating* - `paginate-this` allows you to add controls to your rows that will send requests to update the corresponding item on the server,
and then update the item in place in the data table.
2. *Custom components* - We provide decorators that allow you to build custom components, in case you don't like our datatables & controls.

Inline updating is implemented through a technique that we call composing actions.

#### Composing Actions

`paginate-this` uses the flux pattern of dispatching actions to the store and then updating the views that depend on the state.
To give you complete control of the pagination state, we expose these actions in two different ways. In standalone mode, import
the [actionFactory](#tbd) function to generate a set of actions specific to your list. `redux` users will want to use the [composables](#tbd) function. 
The most common use case for composing actions would be [updating an item within the list](#tbd), which we'll demonstrate by example.

##### actionFactory

As an example, consider a datatable where one column has a checkbox that's supposed to mark an item as active or inactive.
Assuming that you have a `listId` of `'recipeGrid'`, you could write an action creator like this to update the record on the server
and then toggle the active state of the corresponding recipe within the list:

```javascript
import api from 'ROOT/api'
import { actionFactory } from 'paginate-this'

const pageActions = actionFactory('recipeGrid')

export function toggleActive(recipe) {
  const data = {
    active: !recipe.get('active')
  }

  return pageActions.updateAsync(
    recipe.get('id'),
    data,
    api.recipes.update(data)
  )
}
```

At this point you could attach your composed action to a custom checkbox in the datatable like so:

```javascript
import React, { PropTypes } from 'react'
import { DataTable, Paginator } from 'paginate-this'
import * as actions from './actions'

export function Recipes({ toggle })  {
  const headers = {
    return [{
      field: 'name',
      text: 'Name'
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
  }

  return (
    <section>
      <Paginator listId="recipeGrid"  />
      <DataTable listId="recipeGrid" headers={headers} />
    </section>
  )
}

export default props => <Recipes {...props} toggle={actions.toggleActive} />
```

##### composables

If you're using `redux`, composing your actions doesn't really change much. The main difference is that with `redux`,
actions are usually injected into components through the `connect` function, which binds them to the dispatch. The actions
you get from `actionFactory` are already bound to the dispatch, so we also provide their unbound counterparts via the `composables`
function.


```javascript
import api from 'ROOT/api'
import { composables } from 'paginate-this'

const pageActions = composables({ listId: 'recipeGrid' })

export function toggleActive(recipe) {
  const data = {
    active: !recipe.get('active')
  }

  return pageActions.updateAsync(
    recipe.get('id'),
    data,
    api.recipes.update(data)
  )
}
```

Now you can bring this action creator into your connected component using `connect` and `mapDispatchToProps`:

```javascript
import React, { PropTypes } from 'react'
import { DataTable, Paginator } from 'paginate-this'
import * as actions from './actions'

export function Recipes({ toggle }) {
  ...
}

export default connect(
  undefined,
  { toggle: toggleActive }
)(Recipes)
```

#### Building Custom Components

We understand that every product team could potentially want something different, and our premade components sometimes just won't fit that mold. We want to make it painless
to write your own components, so to accomplish that, we made sure that it was every bit as painless to write ours. The best way to see how to build a custom component
is to look at some of the simpler premade components. For example, here's a link that retrieves the next page of records:

```javascript
import React, { PropTypes } from 'react'
import { flip } from './decorators'

export function Next({ pageActions, hasNextPage }) {
  return (
    <button type="button" disabled={!hasNextPage} onClick={pageActions.next}>
      <i className="fa fa-chevron-right" />
    </button>
  )
}

Next.propTypes = {
  pageActions: PropTypes.shape({
    next: PropTypes.func.isRequired
  }).isRequired,
  hasNextPage: PropTypes.bool
}

export default flip(Next)
```

And here's a button that can sort our list in either direction by a given field name:

```javascript
import React, { PropTypes } from 'react'
import { sort as decorate } from './decorators'

export function ColumnHeader({ pageActions, field, text, sort, sortReverse, sortable=true }) {
  if (!sortable) {
    return <span>{text}</span>
  }

  const sortByField = () =>
    pageActions.sort(field, !sortReverse)

  const arrow = sort === field && (
    sortReverse ? 'sort-desc' : 'sort-asc'
  )

  const icon = arrow || 'sort'

  return (
    <button onClick={sortByField}>
      {text}
      <i className={`fa fa-${icon}`} />
    </button>
  )
}

ColumnHeader.propTypes = {
  sort: PropTypes.string,
  sortReverse: PropTypes.bool,
  pageActions: PropTypes.object,
  field: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  sortable: PropTypes.bool
}

export default decorate(ColumnHeader)

```

These components are simple and small enough to be written as pure functions rather than classes, and you should be able
to accomplish the same. As you might have guessed, we expose the `flip` and `sorter` functions that are being called as the default export
for our components, and those functions decorate your components with props that allow you to read and update the pagination state.
The only prop that callers need to supply to these components is
a `listId`, and one or two additional props in some cases. Simply import our decorators into your custom component:

```javascript
import { decorators } from 'paginate-this'
```

and you are ready to roll your own:

```javascript
// Supports 'previous' and 'next' links
export defaut decorators.flip(MyFlipperComponent)

// Supports full pagination controls
export default decorators.paginate(MyPaginationComponent)

// Supports grids/datatables
export default decorators.tabulate(MyDataGridComponent)

// Supprts controls for changing the page size
export default decorators.stretch(MyPageSizeDropdown)

// Supports a control for sorting the list by the field name
export default decorators.sort(MySortLink)

// The kitchen sink! Injects properties from all decorators
export default decorators.paginateThis(MyPaginatedGridComponent)
```

For more on using decorators or creating your own, [check the docs on decorators](#tbd).

## Contributing

If you wish to contribute, please create a fork and submit a pull request, which will be reviewed as soon as humanly possible. A couple of
key points:

1. Don't check in any changes to the `lib` folder. When we are ready to publish a new version, we will do a build and commit the `lib` changes and the new version number.
2. Add tests for your feature, and make sure all existing tests still pass and that the code passes lint (described further below).

### Testing

This package is tested with mocha. The project uses CI through Travis which includes running tests, linting, and code coverage.
Please make sure to write tests for any new pull requests. Code coverage will block the PR if your code is not sufficiently covered.


## TBD

1. Need to move & rework [existing documentation](https://sslotsky.gitbooks.io/violet-paginator/content/)

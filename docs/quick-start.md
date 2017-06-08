## Without Redux

```javascript
import React from 'react'
import { initializeStore, paginate, Paginator, DataTable } from '@orange-marmalade/paginate-this'
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

## With Redux

```javascript
// main.jsx

import React from 'react'
import ReactDOM from 'react-dom'

import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { initializeStore, createPaginator } from '@orange-marmalade/paginate-this'

import App from './App'
import api from 'ROOT/api'

function fetchRecipes(pageInfo) {
  return () => api.recipes.index(pageInfo.query)
}

const store = createStore(createPaginator({
  listId: 'recipeGrid',
  fetch
}))

initializeStore(store)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)

```

```javascript
// MyList.jsx
import React from 'react'
import { Paginator, DataTable } from '@orange-marmalade/paginate-this'


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


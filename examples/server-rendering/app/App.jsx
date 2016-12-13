import React, { Component } from 'react'
import { VioletPaginator, VioletDataTable } from 'violet-paginator'
import { connect } from 'react-redux'

const results = [{
  name: 'Ewe and IPA'
}, {
  name: 'Pouty Stout'
}]

const preloaded = {
  results: results.slice(0, 1),
  totalCount: 2
}

const mockFetch = pageInfo => () => {
  const data = {
    ...preloaded,
    results: results.slice(pageInfo.query.page - 1, pageInfo.query.page)
  }

  return Promise.resolve({ data })
}

export function App({ fetch }) {
  const props = {
    pageSize: 1,
    totalCountProp: 'totalCount',
    fetch,
    preloaded,
    listId: 'recipes'
  }

  const headers = [{
    field: 'name',
    text: 'Name',
    sortable: false
  }]

  return(
    <div>
      <h1>Hello World!</h1>
      <VioletPaginator {...props} />
      <VioletDataTable {...props} headers={headers} />
    </div>
  )
}

export default connect(
  undefined,
  { fetch: mockFetch }
)(App)

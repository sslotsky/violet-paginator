import React from 'react'
import ReactDOM from 'react-dom'

import { compose, createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'

import '../styles.scss'

import { initializeStore, configurePageParams, middleware, debug } from '@orange-marmalade/paginate-this'

import reducers from './reducers'
import App from './App'

debug()
initializeStore()

configurePageParams({
  perPage: 'results_per_page',
  sortOrder: 'sort_reverse',
  sortReverse: true
})

ReactDOM.render(<App />, document.getElementById('app'))

import { List } from 'immutable'
import React from 'react'
import { render } from 'react-dom'
import { pagination } from 'violet-paginator'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import App from './App'

const preloadedState = window.__PRELOADED_STATE__
console.log(preloadedState)
const reducer = combineReducers({ pagination })
const store = createStore(reducer, {
  pagination: List(preloadedState.pagination)
}, compose(applyMiddleware(thunk)))

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)


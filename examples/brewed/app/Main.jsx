import React from 'react'
import ReactDOM from 'react-dom'

import { compose, createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'

import { loadTranslations, setLocale, syncTranslationWithStore, I18n } from 'react-redux-i18n'

import '../styles.scss'

import translations from 'CONF/locales'
import { initializeStore, configurePageParams, middleware, debug } from '@orange-marmalade/paginate-this'

import reducers from './reducers'
import App from './App'

const devtools = window.devToolsExtension ? window.devToolsExtension() : f => f

const store = createStore(
  reducers,
  applyMiddleware(middleware.jelly, middleware.spill)
)

initializeStore(store)

configurePageParams({
  perPage: 'results_per_page',
  sortOrder: 'sort_reverse',
  sortReverse: true
})

syncTranslationWithStore(store)
store.dispatch(loadTranslations(translations))
store.dispatch(setLocale('en')) // TODO: resolve dynamically

ReactDOM.render((
  <Provider store={store}>
    <div>
      <App />
    </div>
  </Provider>
), document.getElementById('app'))

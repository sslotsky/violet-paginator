import { List } from 'immutable'
import expect from 'expect'
import PromiseMock from 'promise-mock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import register, { destroyAll } from '../src/actions'
import { defaultPaginator } from '../src/reducer'
import * as actionTypes from '../src/actionTypes'

const listId = 'someId'
const mockStore = configureMockStore([thunk])

const setup = (pass=true) => {
  const paginator = defaultPaginator.set('id', listId)
  const store = mockStore({ pagination: List.of(paginator) })
  const data = {
    total_count: 1,
    results: [{ name: 'Ewe and IPA' }]
  }

  const fetch = () => () =>
    (pass && Promise.resolve({ data })) || Promise.reject(new Error('An error'))

  const pageActions = register({
    isBoundToDispatch: false,
    listId,
    fetch
  })

  return { paginator, store, pageActions }
}

describe('pageActions.reload', () => {
  beforeEach(() => {
    PromiseMock.install()
  })

  afterEach(() => {
    PromiseMock.uninstall()
  })


  context('when fetch succeeds', () => {
    it('dispatches RESULTS_UPDATED', () => {
      const { pageActions, store } = setup()

      let rejected = false
      store.dispatch(pageActions.reload).then(() => {
        const actions = store.getActions()
        const types = actions.map(a => a.type)
        expect(types).toEqual([actionTypes.FETCH_RECORDS, actionTypes.RESULTS_UPDATED])
      }).catch(() => {
        rejected = true
      })

      Promise.runAll()
      expect(rejected).toBe(false)
    })

    context('when results props are configured', () => {
      const paginator = defaultPaginator.set('id', listId)
      const store = mockStore({ pagination: List.of(paginator) })
      const data = {
        total_entries: 1,
        recipes: [{ name: 'Ewe and IPA' }]
      }

      const fetch = () => () => Promise.resolve({ data })

      const pageActions = register({
        resultsProp: 'recipes',
        totalCountProp: 'total_entries',
        isBoundToDispatch: false,
        listId,
        fetch
      })

      it('is able to read the results', () => {
        let rejected = false
        store.dispatch(pageActions.reload).then(() => {
          const action = store.getActions().find(a => a.type === actionTypes.RESULTS_UPDATED)
          expect(action.results).toEqual(data.recipes)
        }).catch(() => {
          rejected = true
        })

        Promise.runAll()
        expect(rejected).toBe(false)
      })

      it('is able to read the count', () => {
        let rejected = false
        store.dispatch(pageActions.reload).then(() => {
          const action = store.getActions().find(a => a.type === actionTypes.RESULTS_UPDATED)
          expect(action.totalCount).toEqual(data.total_entries)
        }).catch(() => {
          rejected = true
        })

        Promise.runAll()
        expect(rejected).toBe(false)
      })
    })
  })

  context('when fetch fails', () => {
    it('dispatches RESULTS_UPDATED_ERROR', () => {
      const { pageActions, store } = setup(false)

      let rejected = false
      store.dispatch(pageActions.reload).then(() => {
        const actions = store.getActions()
        const types = actions.map(a => a.type)
        expect(types).toEqual([actionTypes.FETCH_RECORDS, actionTypes.RESULTS_UPDATED_ERROR])
      }).catch(() => {
        rejected = true
      })

      Promise.runAll()
      expect(rejected).toBe(false)
    })
  })
})

describe('pageActions.next', () => {
  beforeEach(() => {
    PromiseMock.install()
  })

  afterEach(() => {
    PromiseMock.uninstall()
  })

  it('dispatches NEXT_PAGE', () => {
    const { pageActions, store } = setup()
    const expectedAction = {
      type: actionTypes.NEXT_PAGE,
      id: listId
    }

    let rejected = false
    store.dispatch(pageActions.next()).then(() => {
      const actions = store.getActions()
      expect(actions).toInclude(expectedAction)
    }).catch(() => {
      rejected = true
    })

    Promise.runAll()
    expect(rejected).toBe(false)
  })
})

describe('pageActions.prev', () => {
  beforeEach(() => {
    PromiseMock.install()
  })

  afterEach(() => {
    PromiseMock.uninstall()
  })

  it('dispatches PREV_PAGE', () => {
    const { pageActions, store } = setup()
    const expectedAction = {
      type: actionTypes.PREVIOUS_PAGE,
      id: listId
    }

    let rejected = false
    store.dispatch(pageActions.prev()).then(() => {
      const actions = store.getActions()
      expect(actions).toInclude(expectedAction)
    }).catch(() => {
      rejected = true
    })

    Promise.runAll()
    expect(rejected).toBe(false)
  })
})

describe('pageActions.goTo', () => {
  beforeEach(() => {
    PromiseMock.install()
  })

  afterEach(() => {
    PromiseMock.uninstall()
  })

  it('dispatches GO_TO_PAGE', () => {
    const { pageActions, store } = setup()
    const page = 2
    const expectedAction = {
      type: actionTypes.GO_TO_PAGE,
      page,
      id: listId
    }

    let rejected = false
    store.dispatch(pageActions.goTo(page)).then(() => {
      const actions = store.getActions()
      expect(actions).toInclude(expectedAction)
    }).catch(() => {
      rejected = true
    })

    Promise.runAll()
    expect(rejected).toBe(false)
  })
})

describe('pageActions.setPageSize', () => {
  beforeEach(() => {
    PromiseMock.install()
  })

  afterEach(() => {
    PromiseMock.uninstall()
  })

  it('dispatches SET_PAGE_SIZE', () => {
    const { pageActions, store } = setup()
    const size = 25
    const expectedAction = {
      type: actionTypes.SET_PAGE_SIZE,
      size,
      id: listId
    }

    let rejected = false
    store.dispatch(pageActions.setPageSize(size)).then(() => {
      const actions = store.getActions()
      expect(actions).toInclude(expectedAction)
    }).catch(() => {
      rejected = true
    })

    Promise.runAll()
    expect(rejected).toBe(false)
  })
})

describe('pageActions.toggleFilterItem', () => {
  beforeEach(() => {
    PromiseMock.install()
  })

  afterEach(() => {
    PromiseMock.uninstall()
  })

  it('dispatches TOGGLE_FILTER_ITEM', () => {
    const { pageActions, store } = setup()
    const field = 'status_types'
    const value = 'inactive'
    const expectedAction = {
      type: actionTypes.TOGGLE_FILTER_ITEM,
      field,
      value,
      id: listId
    }

    let rejected = false
    store.dispatch(pageActions.toggleFilterItem(field, value)).then(() => {
      const actions = store.getActions()
      expect(actions).toInclude(expectedAction)
    }).catch(() => {
      rejected = true
    })

    Promise.runAll()
    expect(rejected).toBe(false)
  })
})

describe('pageActions.setFilter', () => {
  beforeEach(() => {
    PromiseMock.install()
  })

  afterEach(() => {
    PromiseMock.uninstall()
  })

  it('dispatches SET_FILTER', () => {
    const { pageActions, store } = setup()
    const field = 'name'
    const value = { like: 'IPA' }
    const expectedAction = {
      type: actionTypes.SET_FILTER,
      field,
      value,
      id: listId
    }

    let rejected = false
    store.dispatch(pageActions.setFilter(field, value)).then(() => {
      const actions = store.getActions()
      expect(actions).toInclude(expectedAction)
    }).catch(() => {
      rejected = true
    })

    Promise.runAll()
    expect(rejected).toBe(false)
  })
})

describe('pageActions.setFilters', () => {
  beforeEach(() => {
    PromiseMock.install()
  })

  afterEach(() => {
    PromiseMock.uninstall()
  })

  it('dispatches SET_FILTERS', () => {
    const { pageActions, store } = setup()
    const filters = { name: { like: 'IPA' } }
    const expectedAction = {
      type: actionTypes.SET_FILTERS,
      id: listId,
      filters
    }

    let rejected = false
    store.dispatch(pageActions.setFilters(filters)).then(() => {
      const actions = store.getActions()
      expect(actions).toInclude(expectedAction)
    }).catch(() => {
      rejected = true
    })

    Promise.runAll()
    expect(rejected).toBe(false)
  })
})

describe('pageActions.resetFilters', () => {
  beforeEach(() => {
    PromiseMock.install()
  })

  afterEach(() => {
    PromiseMock.uninstall()
  })

  it('dispatches RESET_FILTERS', () => {
    const { pageActions, store } = setup()
    const filters = { name: { like: 'IPA' } }
    const expectedAction = {
      type: actionTypes.RESET_FILTERS,
      id: listId,
      filters
    }

    let rejected = false
    store.dispatch(pageActions.resetFilters(filters)).then(() => {
      const actions = store.getActions()
      expect(actions).toInclude(expectedAction)
    }).catch(() => {
      rejected = true
    })

    Promise.runAll()
    expect(rejected).toBe(false)
  })
})

describe('pageActions.sort', () => {
  beforeEach(() => {
    PromiseMock.install()
  })

  afterEach(() => {
    PromiseMock.uninstall()
  })

  it('dispatches SORT_CHANGED', () => {
    const { pageActions, store } = setup()
    const field = 'name'
    const reverse = false
    const expectedAction = {
      type: actionTypes.SORT_CHANGED,
      field,
      reverse,
      id: listId
    }

    let rejected = false
    store.dispatch(pageActions.sort(field, reverse)).then(() => {
      const actions = store.getActions()
      expect(actions).toInclude(expectedAction)
    }).catch(() => {
      rejected = true
    })

    Promise.runAll()
    expect(rejected).toBe(false)
  })
})

describe('updatingItem', () => {
  it('dispatches UPDATING_ITEM', () => {
    const { pageActions, store } = setup()
    const itemId = 42
    const expectedAction = {
      type: actionTypes.UPDATING_ITEM,
      id: listId,
      itemId
    }

    expect(store.dispatch(pageActions.updatingItem(itemId))).toEqual(expectedAction)
  })
})

describe('removingItem', () => {
  it('dispatches REMOVING_ITEM', () => {
    const { pageActions, store } = setup()
    const itemId = 42
    const expectedAction = {
      type: actionTypes.REMOVING_ITEM,
      id: listId,
      itemId
    }

    expect(store.dispatch(pageActions.removingItem(itemId))).toEqual(expectedAction)
  })
})

describe('updateItem', () => {
  it('dispatches UPDATE_ITEM', () => {
    const { pageActions, store } = setup()
    const itemId = 42
    const data = { name: 'Ewe and IPA' }
    const expectedAction = {
      type: actionTypes.UPDATE_ITEM,
      id: listId,
      itemId,
      data
    }

    expect(store.dispatch(pageActions.updateItem(itemId, data))).toEqual(expectedAction)
  })
})

describe('removeItem', () => {
  it('dispatches REMOVE_ITEM', () => {
    const { pageActions, store } = setup()
    const itemId = 42
    const expectedAction = {
      type: actionTypes.REMOVE_ITEM,
      id: listId,
      itemId
    }

    expect(store.dispatch(pageActions.removeItem(itemId))).toEqual(expectedAction)
  })
})

describe('destroy', () => {
  it('dispatches DESTROY_PAGINATOR', () => {
    const { pageActions, store } = setup()
    const expectedAction = {
      type: actionTypes.DESTROY_PAGINATOR,
      id: listId
    }

    expect(store.dispatch(pageActions.destroy())).toEqual(expectedAction)
  })
})

describe('destroyAll', () => {
  it('dispatches DESTROY_ALL', () => {
    const { store } = setup()
    const expectedAction = {
      type: actionTypes.DESTROY_ALL
    }

    expect(store.dispatch(destroyAll())).toEqual(expectedAction)
  })
})

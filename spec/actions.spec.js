import Immutable, { List } from 'immutable'
import expect from 'expect'
import PromiseMock from 'promise-mock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import register, { destroyAll, expireAll } from '../src/actions'
import { defaultPaginator } from '../src/reducer'
import * as actionTypes from '../src/actionTypes'
import expectAsync from './specHelper'

const listId = 'someId'
const mockStore = configureMockStore([thunk])

const setup = (pass=true, results=[]) => {
  const paginator = defaultPaginator
    .set('id', listId)
    .set('results', Immutable.fromJS(results))

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

describe('pageActions', () => {
  describe('pageActions.initialize', () => {
    context('when preloaded data is given', () => {
      it('attaches the preloaded data to the action', () => {
        const preloaded = {
          results: [{ name: 'Ewe and IPA' }],
          totalCount: 1
        }

        const store = mockStore({ pagination: List() })
        const pageActions = register({
          isBoundToDispatch: false,
          listId,
          fetch: () => {},
          preloaded
        })

        const expectedAction = {
          type: actionTypes.INITIALIZE_PAGINATOR,
          id: listId,
          preloaded
        }

        expect(store.dispatch(pageActions.initialize())).toEqual(expectedAction)
      })
    })
  })

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

        expectAsync(
          store.dispatch(pageActions.reload()).then(() => {
            const actions = store.getActions()
            const types = actions.map(a => a.type)
            expect(types).toEqual([actionTypes.FETCH_RECORDS, actionTypes.RESULTS_UPDATED])
          })
        )
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
          expectAsync(
            store.dispatch(pageActions.reload()).then(() => {
              const action = store.getActions().find(a => a.type === actionTypes.RESULTS_UPDATED)
              expect(action.results).toEqual(data.recipes)
            })
          )
        })

        it('is able to read the count', () => {
          expectAsync(
            store.dispatch(pageActions.reload()).then(() => {
              const action = store.getActions().find(a => a.type === actionTypes.RESULTS_UPDATED)
              expect(action.totalCount).toEqual(data.total_entries)
            })
          )
        })
      })
    })

    context('when fetch fails', () => {
      it('dispatches RESULTS_UPDATED_ERROR', () => {
        const { pageActions, store } = setup(false)

        expectAsync(
          store.dispatch(pageActions.reload()).then(() => {
            const actions = store.getActions()
            const types = actions.map(a => a.type)
            expect(types).toEqual([actionTypes.FETCH_RECORDS, actionTypes.RESULTS_UPDATED_ERROR])
          })
        )
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

      expectAsync(
        store.dispatch(pageActions.next()).then(() => {
          const actions = store.getActions()
          expect(actions).toInclude(expectedAction)
        })
      )
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

      expectAsync(
        store.dispatch(pageActions.prev()).then(() => {
          const actions = store.getActions()
          expect(actions).toInclude(expectedAction)
        })
      )
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

      expectAsync(
        store.dispatch(pageActions.goTo(page)).then(() => {
          const actions = store.getActions()
          expect(actions).toInclude(expectedAction)
        })
      )
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

      expectAsync(
        store.dispatch(pageActions.setPageSize(size)).then(() => {
          const actions = store.getActions()
          expect(actions).toInclude(expectedAction)
        })
      )
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

      expectAsync(
        store.dispatch(pageActions.toggleFilterItem(field, value)).then(() => {
          const actions = store.getActions()
          expect(actions).toInclude(expectedAction)
        })
      )
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

      expectAsync(
        store.dispatch(pageActions.setFilter(field, value)).then(() => {
          const actions = store.getActions()
          expect(actions).toInclude(expectedAction)
        })
      )
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

      expectAsync(
        store.dispatch(pageActions.setFilters(filters)).then(() => {
          const actions = store.getActions()
          expect(actions).toInclude(expectedAction)
        })
      )
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

      expectAsync(
        store.dispatch(pageActions.resetFilters(filters)).then(() => {
          const actions = store.getActions()
          expect(actions).toInclude(expectedAction)
        })
      )
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

      expectAsync(
        store.dispatch(pageActions.sort(field, reverse)).then(() => {
          const actions = store.getActions()
          expect(actions).toInclude(expectedAction)
        })
      )
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

  describe('updatingItems', () => {
    it('dispatches UPDATING_ITEMS', () => {
      const { pageActions, store } = setup()
      const itemIds = [42, 43]
      const expectedAction = {
        type: actionTypes.UPDATING_ITEMS,
        id: listId,
        itemIds
      }

      expect(store.dispatch(pageActions.updatingItems(itemIds))).toEqual(expectedAction)
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

  describe('updateItems', () => {
    it('dispatches UPDATE_ITEMS', () => {
      const { pageActions, store } = setup()
      const itemIds = [42, 43]
      const data = { active: false }
      const expectedAction = {
        type: actionTypes.UPDATE_ITEMS,
        id: listId,
        itemIds,
        data
      }

      expect(store.dispatch(pageActions.updateItems(itemIds, data))).toEqual(expectedAction)
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

  describe('expire', () => {
    it('dispatches EXPIRE_PAGINATOR', () => {
      const { pageActions, store } = setup()
      const expectedAction = {
        type: actionTypes.EXPIRE_PAGINATOR,
        id: listId
      }

      expect(store.dispatch(pageActions.expire())).toEqual(expectedAction)
    })
  })

  describe('expireAll', () => {
    it('dispatches EXPIRE_ALL', () => {
      const { store } = setup()
      const expectedAction = {
        type: actionTypes.EXPIRE_ALL
      }

      expect(store.dispatch(expireAll())).toEqual(expectedAction)
    })
  })

  describe('updateAsync', () => {
    const itemId = 'itemId'

    beforeEach(() => {
      PromiseMock.install()
    })

    afterEach(() => {
      PromiseMock.uninstall()
    })

    context('on update success', () => {
      it('updates the item', () => {
        const { pageActions, store } = setup()
        const updateData = { active: true }
        const serverVersion = { active: false }
        const update = Promise.resolve(serverVersion)

        const expectedActions = [
          pageActions.updateItem(itemId, updateData),
          pageActions.updatingItem(itemId),
          pageActions.updateItem(itemId, serverVersion)
        ]

        expectAsync(
          store.dispatch(pageActions.updateAsync(itemId, updateData, update)).then(() => {
            expect(store.getActions()).toEqual(expectedActions)
          })
        )
      })
    })

    context('on update failure', () => {
      it('reverts the item', () => {
        const record = {
          id: itemId,
          name: 'Ewe and IPA'
        }
        const results = [record]
        const { pageActions, store } = setup(true, results)

        const updateData = {
          name: 'Pouty Stout',
          extraProp: 'To be removed'
        }

        const error = 'server error'
        const update = Promise.reject(error)

        const expectedActions = [
          pageActions.updateItem(itemId, updateData),
          pageActions.updatingItem(itemId),
          pageActions.resetItem(itemId, record),
          pageActions.itemError(itemId, error)
        ]

        expectAsync(
          store.dispatch(pageActions.updateAsync(itemId, updateData, update)).then(() => {
            const actions = store.getActions()
            expect(actions).toEqual(expectedActions)
          })
        )
      })
    })
  })

  describe('updateAllAsync', () => {
    const itemId = 'itemId'

    beforeEach(() => {
      PromiseMock.install()
    })

    afterEach(() => {
      PromiseMock.uninstall()
    })

    context('on update success', () => {
      const updateData = { active: true }

      context('with default settings', () => {
        const serverVersion = { active: false }
        const results = [{ id: 1, name: 'Ewe and IPA' }]

        it('updates all the items', () => {
          const ids = results.map(r => r.id)
          const { pageActions, store } = setup(true, results)
          const expectedActions = [
            pageActions.updateItems(ids, updateData),
            pageActions.updatingItems(ids),
            pageActions.updateItems(ids, updateData),
            pageActions.updateItems(ids, serverVersion)
          ]

          const update = Promise.resolve(serverVersion)

          expectAsync(
            store.dispatch(pageActions.updateAllAsync(updateData, update)).then(() => {
              expect(store.getActions()).toEqual(expectedActions)
            })
          )
        })
      })

      context('with reset=true', () => {
        const serverVersion = [{ id: 1, name: 'Ewe and IPA', active: false }]
        const results = [{ id: 1, name: 'Ewe and IPA' }]

        it('resets the items', () => {
          const { pageActions, store } = setup(true, results)
          const ids = results.map(r => r.id)
          const expectedActions = [
            pageActions.updateItems(ids, updateData),
            pageActions.updatingItems(ids),
            pageActions.updateItems(ids, updateData),
            pageActions.resetResults(serverVersion)
          ]

          const update = Promise.resolve(serverVersion)

          expectAsync(
            store.dispatch(pageActions.updateAllAsync(updateData, update, true)).then(() => {
              expect(store.getActions()).toEqual(expectedActions)
            })
          )
        })
      })
    })

    context('on update failure', () => {
      it('reverts the results', () => {
        const record = {
          id: itemId,
          name: 'Ewe and IPA',
          active: true
        }

        const results = [record]
        const ids = [record.id]

        const { pageActions, store } = setup(true, results)
        const updateData = { active: false }
        const error = 'server error'
        const update = Promise.reject(error)

        const expectedActions = [
          pageActions.updateItems(ids, updateData),
          pageActions.updatingItems(ids),
          pageActions.resetResults(results),
          pageActions.markItemsErrored(ids, error)
        ]

        expectAsync(
          store.dispatch(pageActions.updateAllAsync(updateData, update)).then(() => {
            const actions = store.getActions()
            expect(actions).toEqual(expectedActions)
          })
        )
      })
    })
  })

  describe('removeAsync', () => {
    const itemId = 'itemId'

    beforeEach(() => {
      PromiseMock.install()
    })

    afterEach(() => {
      PromiseMock.uninstall()
    })

    context('on remove success', () => {
      it('removes the item', () => {
        const { pageActions, store } = setup()
        const remove = Promise.resolve()

        const expectedActions = [
          pageActions.removingItem(itemId),
          pageActions.removeItem(itemId)
        ]

        expectAsync(
          store.dispatch(pageActions.removeAsync(itemId, remove)).then(() => {
            expect(store.getActions()).toEqual(expectedActions)
          })
        )
      })
    })

    context('on remove failure', () => {
      it('reverts the item', () => {
        const record = {
          id: itemId,
          name: 'Ewe and IPA'
        }
        const results = [record]
        const { pageActions, store } = setup(true, results)

        const error = 'server error'
        const remove = Promise.reject(error)

        const expectedActions = [
          pageActions.removingItem(itemId),
          pageActions.resetItem(itemId, record),
          pageActions.itemError(itemId, error)
        ]

        expectAsync(
          store.dispatch(pageActions.removeAsync(itemId, remove)).then(() => {
            const actions = store.getActions()
            expect(actions).toEqual(expectedActions)
          })
        )
      })
    })
  })
})

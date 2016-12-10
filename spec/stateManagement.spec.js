import { Set } from 'immutable'
import expect from 'expect'
import {
  isUpdating,
  isRemoving,
  preloadedPaginator,
  currentQuery,
  registerPaginator,
  getPaginator
} from '../src/lib/stateManagement'
import createReducer, { defaultPaginator } from '../src/reducer'
import actionType, * as actionTypes from '../src/actionTypes'
import { translate } from '../src/pageInfoTranslator'

const [id, itemId] = ['recipes', 1]
const reducer = createReducer(id)
const resolve = t => actionType(t, id)

describe('State management utilities', () => {
  describe('preloadedPaginator', () => {
    const state = { [id]: reducer(undefined) }

    context('when there is no preloaded data', () => {
      const paginator = preloadedPaginator(state, id)

      it('returns the defaultPaginator', () => {
        expect(paginator).toEqual(defaultPaginator)
      })
    })

    context('when preloaded data is supplied', () => {
      const preloaded = {
        results: [{ name: 'Ewe and IPA' }],
        totalCount: 1
      }

      const paginator = preloadedPaginator(state, 'someId', preloaded)

      it('merges the preloaded data', () => {
        expect(paginator).toEqual(defaultPaginator.merge(preloaded))
      })
    })
  })

  describe('registerPaginator', () => {
    context('when provided a locator', () => {
      const locator = () => defaultPaginator
      const registeredLocator = registerPaginator(id, locator)

      it('returns the locator', () => {
        expect(registeredLocator).toEqual(locator)
      })
    })

    context('when not provided a locator', () => {
      const locator = registerPaginator(id)

      it('returns a locator that retrieves state by listId', () => {
        const state = { [id]: defaultPaginator }
        expect(locator(state)).toEqual(defaultPaginator)
      })
    })
  })

  describe('currentQuery', () => {
    const initialize = {
      type: actionTypes.INITIALIZE_PAGINATOR,
      id
    }

    const state = { pagination: reducer(undefined, initialize) }
    const expectedQuery = translate(getPaginator(state, id))

    it('returns the same query that gets passed to config.fetch', () => {
      expect(currentQuery(state, id)).toEqual(expectedQuery)
    })
  })

  describe('getPaginator', () => {
    const paginator = defaultPaginator.set('pageSize', 50)

    context('when locator is registered', () => {
      const locator = state => state.users.grid
      beforeEach(() => {
        registerPaginator(id, locator)
      })

      const state = { users: { grid: paginator } }

      it('uses the locator to lookup the state', () => {
        expect(getPaginator(id, state)).toEqual(paginator)
      })
    })

    context('when locator is not registered', () => {
      const userGridId = 'users'
      registerPaginator(userGridId)
      const state = { [userGridId]: paginator }

      it('looks up the state by listId', () => {
        expect(getPaginator(userGridId, state)).toEqual(paginator)
      })
    })

    context('when there is no matching reducer', () => {
      it('returns the defaultPaginator', () => {
        expect(getPaginator('unregisteredId', {})).toEqual(defaultPaginator)
      })
    })
  })

  describe('isUpdating', () => {
    context('when an item is updating', () => {
      beforeEach(() => {
        registerPaginator(id)
      })

      const initialize = {
        type: resolve(actionTypes.INITIALIZE_PAGINATOR),
        updating: Set.of(itemId)
      }

      const state = { recipes: reducer(undefined, initialize) }

      it('returns true', () => {
        expect(isUpdating(state, id, itemId)).toBe(true)
      })
    })

    context('when an item is not updating', () => {
      const initialize = {
        type: resolve(actionTypes.INITIALIZE_PAGINATOR)
      }

      const state = reducer(undefined, initialize)

      it('returns false', () => {
        expect(isUpdating(state, itemId)).toBe(false)
      })
    })
  })

  describe('isRemoving', () => {
    context('when an item is being removed', () => {
      const initialize = {
        type: resolve(actionTypes.INITIALIZE_PAGINATOR),
        removing: Set.of(itemId)
      }

      const state = reducer(undefined, initialize)

      it('returns true', () => {
        expect(isRemoving(state, itemId)).toBe(true)
      })
    })

    context('when an item is not being removed', () => {
      const initialize = {
        type: resolve(actionTypes.INITIALIZE_PAGINATOR)
      }

      const state = reducer(undefined, initialize)

      it('returns false', () => {
        expect(isRemoving(state, itemId)).toBe(false)
      })
    })
  })
})

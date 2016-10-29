import { Set } from 'immutable'
import expect from 'expect'
import getPaginator, { isUpdating, isRemoving } from '../src/lib/stateManagement'
import reducer, { defaultPaginator } from '../src/reducer'
import * as actionTypes from '../src/actionTypes'

describe('getPaginator', () => {
  const id = 'someId'
  const initialize = {
    type: actionTypes.INITIALIZE_PAGINATOR,
    id
  }

  const state = { pagination: reducer(undefined, initialize) }

  context('when the paginator has been initialized', () => {
    it('returns the paginator', () => {
      const paginator = getPaginator(state, id)
      expect(paginator.get('id')).toEqual(id)
    })
  })

  context('when the paginator does not exit', () => {
    it('returns a blank Map', () => {
      const paginator = getPaginator(state, 'otherId')
      expect(paginator).toEqual(defaultPaginator)
    })
  })
})

describe('isUpdating', () => {
  context('when the list is bulkUpdating', () => {
    const id = 'recipes'
    const initialize = {
      type: actionTypes.INITIALIZE_PAGINATOR,
      bulkUpdating: true,
      id
    }

    const state = { pagination: reducer(undefined, initialize) }

    it('returns true', () => {
      expect(isUpdating(state, id, 'anyItemId')).toBe(true)
    })
  })

  context('when an item is updating', () => {
    const [id, itemId] = ['recipes', 1]
    const initialize = {
      type: actionTypes.INITIALIZE_PAGINATOR,
      updating: Set.of(itemId),
      id
    }

    const state = { pagination: reducer(undefined, initialize) }

    it('returns true', () => {
      expect(isUpdating(state, id, itemId)).toBe(true)
    })
  })

  context('when an item is not updating', () => {
    const [id, itemId] = ['recipes', 1]
    const initialize = {
      type: actionTypes.INITIALIZE_PAGINATOR,
      id
    }

    const state = { pagination: reducer(undefined, initialize) }

    it('returns false', () => {
      expect(isUpdating(state, id, itemId)).toBe(false)
    })
  })
})

describe('isRemoving', () => {
  context('when an item is being removed', () => {
    const [id, itemId] = ['recipes', 1]
    const initialize = {
      type: actionTypes.INITIALIZE_PAGINATOR,
      removing: Set.of(itemId),
      id
    }

    const state = { pagination: reducer(undefined, initialize) }

    it('returns true', () => {
      expect(isRemoving(state, id, itemId)).toBe(true)
    })
  })

  context('when an item is not being removed', () => {
    const [id, itemId] = ['recipes', 1]
    const initialize = {
      type: actionTypes.INITIALIZE_PAGINATOR,
      id
    }

    const state = { pagination: reducer(undefined, initialize) }

    it('returns false', () => {
      expect(isRemoving(state, id, itemId)).toBe(false)
    })
  })
})

import expect from 'expect'
import getPaginator from '../src/lib/stateManagement'
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

import expect from 'expect'
import createPaginator from '../../src/reducer'
import { paginate } from '../../src/flux/store'
import { getFlux, initializeStore } from '../../src/flux/flux'

initializeStore()

describe('store utilities', () => {
  beforeEach(() => expect.restoreSpies())

  describe('paginate', () => {
    const config = { listId: 'recipes' }
    paginate(config)

    it('inserts inserts new pagination state into the store', () => {
      expect(getFlux().getState().recipes).toEqual(createPaginator(config)())
    })
  })
})


import expect from 'expect'
import resolveActions from '../../src/flux/resolveActions'
import { initializeStore, getFlux, bindActions } from '../../src/flux/flux'

initializeStore()

describe('resolveActions()', () => {
  context('when actionSelect is a function', () => {
    const props = {}
    const actionSelect = (...args) => args

    it('calls the function with the dispatch and the props', () => {
      const result = resolveActions(props, actionSelect)
      expect(result).toEqual(actionSelect(getFlux().dispatch, props))
    })
  })

  context('when actionSelect is an object', () => {
    const props = {}
    const actionSelect = { foo: () => {} }
    const result = resolveActions(props, actionSelect)

    it('binds the actions', () => {
      expect(result).toEqual(bindActions(actionSelect))
    })
  })
})

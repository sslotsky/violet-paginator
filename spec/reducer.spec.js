import { Map, Set } from 'immutable'
import expect from 'expect'
import reducer, { defaultPaginator } from '../src/reducer'
import * as actionTypes from '../src/actionTypes'

const id = 'test-list'

function setup(testPaginator=Map()) {
  const action = {
    ...testPaginator.toJS(),
    type: actionTypes.INITIALIZE_PAGINATOR,
    id
  }

  const state = reducer(undefined, action)

  return { action, state }
}

describe('pagination reducer', () => {
  context('when a list is initialized', () => {
    it('handles SET_FILTER', () => {
      const { state: initialState } = setup()
      const field = 'foo'
      const value = { eq: 'bar' }
      const action = {
        type: actionTypes.SET_FILTER,
        field,
        value,
        id
      }

      const state = reducer(initialState, action).find(p => p.get('id') === id)
      expect(state.getIn(['filters', field]).toJS()).toEqual(value)
    })

    context('and a filter item exists', () => {
      const paginator = defaultPaginator.setIn(['filters', 'myArray'], Set.of('myItem'))
      const { state: initialState } = setup(paginator)

      context('when the filter item is toggled', () => {
        it('is deleted', () => {
          const action = {
            type: actionTypes.TOGGLE_FILTER_ITEM,
            field: 'myArray',
            value: 'myItem',
            id
          }

          const state = reducer(initialState, action).find(p => p.get('id') === id)
          expect(state.getIn(['filters', 'myArray']).toArray()).toExclude('myItem')
        })
      })
    })

    context('and a filter item does not exist', () => {
      const { state: initialState } = setup()

      context('when the filter item is toggled', () => {
        it('is added', () => {
          const action = {
            type: actionTypes.TOGGLE_FILTER_ITEM,
            field: 'myArray',
            value: 'myItem',
            id
          }

          const state = reducer(initialState, action).find(p => p.get('id') === id)
          expect(state.getIn(['filters', 'myArray']).toArray()).toInclude('myItem')
        })
      })
    })
  })
})

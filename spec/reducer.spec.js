import Immutable, { Map, Set } from 'immutable'
import expect from 'expect'
import reducer, { defaultPaginator, initialState as defaultState } from '../src/reducer'
import getPaginator from '../src/lib/stateManagement'
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
    context('with some initial filters', () => {
      it('persists the filter', () => {
        const action = {
          type: actionTypes.INITIALIZE_PAGINATOR,
          id,
          filters: { custom_filter: true }
        }

        const state = getPaginator({ pagination: reducer(undefined, action) }, id)
        expect(state.get('filters').toJS()).toEqual(action.filters)
      })
    })

    context('when handling SET_FILTER', () => {
      const { state: initialState } = setup()
      const field = 'foo'
      const value = { eq: 'bar' }
      const action = {
        type: actionTypes.SET_FILTER,
        field,
        value,
        id
      }

      const state = getPaginator({ pagination: reducer(initialState, action) }, id)

      it('sets the specified filter', () => {
        expect(state.getIn(['filters', field]).toJS()).toEqual(value)
      })

      it('returns to the first page', () => {
        expect(state.get('page')).toEqual(1)
      })
    })

    context('when handling SET_FILTERS', () => {
      const initialFilters = {
        name: { like: 'IPA' },
        show_inactive: { eq: true },
        containers: ['can', 'bottle']
      }

      const paginator = defaultPaginator.merge({
        filters: Immutable.fromJS(initialFilters)
      })

      const { state: initialState } = setup(paginator)
      const updatedFilters = {
        show_inactive: { eq: false },
        fermentation_temperature: { lt: 60 },
        containers: ['growler']
      }

      const action = {
        type: actionTypes.SET_FILTERS,
        filters: updatedFilters,
        id
      }

      const expectedFilters = {
        name: initialFilters.name,
        show_inactive: updatedFilters.show_inactive,
        fermentation_temperature: updatedFilters.fermentation_temperature,
        containers: ['growler']
      }

      const state = getPaginator({ pagination: reducer(initialState, action) }, id)

      it('merges the specified filters', () => {
        expect(state.get('filters').toJS()).toEqual(expectedFilters)
      })

      it('returns to the first page', () => {
        expect(state.get('page')).toEqual(1)
      })
    })

    context('when handling RESET_FILTERS', () => {
      const initialFilters = {
        name: { like: 'IPA' },
        show_inactive: { eq: true }
      }

      const paginator = defaultPaginator.merge({
        filters: Immutable.fromJS(initialFilters)
      })

      const { state: initialState } = setup(paginator)
      const updatedFilters = {
        show_inactive: { eq: false },
        fermentation_temperature: { lt: 60 }
      }

      const action = {
        type: actionTypes.RESET_FILTERS,
        filters: updatedFilters,
        id
      }

      const state = getPaginator({ pagination: reducer(initialState, action) }, id)

      it('resets the filters', () => {
        expect(state.get('filters').toJS()).toEqual(updatedFilters)
      })

      it('returns to the first page', () => {
        expect(state.get('page')).toEqual(1)
      })
    })

    it('handles DESTROY_PAGINATOR', () => {
      const { state: initialState } = setup()
      const action = {
        type: actionTypes.DESTROY_PAGINATOR,
        id
      }

      const state = getPaginator({
        pagination: reducer(initialState, action)
      }, id)
      expect(state).toEqual(defaultPaginator)
    })

    it('handles DESTROY_ALL', () => {
      const { state: initialState } = setup()
      const action = {
        type: actionTypes.DESTROY_ALL
      }

      expect(reducer(initialState, action)).toEqual(defaultState)
    })

    it('handles EXPIRE_PAGINATOR', () => {
      const { state: initialState } = setup()
      const action = {
        type: actionTypes.EXPIRE_PAGINATOR,
        id
      }

      const state = getPaginator({
        pagination: reducer(initialState, action)
      }, id)
      expect(state.get('stale')).toEqual(true)
    })

    it('handles EXPIRE_ALL', () => {
      const { state: initialState } = setup()
      const action = {
        type: actionTypes.EXPIRE_ALL
      }

      const state = reducer(initialState, action)
      expect(state.every(p => p.get('stale'))).toBe(true)
    })

    it('handles PREVIOUS_PAGE', () => {
      const paginator = defaultPaginator.set('page', 2)
      const { state: initialState } = setup(paginator)
      const action = { type: actionTypes.PREVIOUS_PAGE, id }
      const state = getPaginator({ pagination: reducer(initialState, action) }, id)

      expect(state.get('page')).toEqual(1)
    })

    it('handles NEXT_PAGE', () => {
      const { state: initialState } = setup()
      const action = { type: actionTypes.NEXT_PAGE, id }
      const state = getPaginator({ pagination: reducer(initialState, action) }, id)

      expect(state.get('page')).toEqual(2)
    })

    it('handles GO_TO_PAGE', () => {
      const { state: initialState } = setup()
      const action = { type: actionTypes.GO_TO_PAGE, size: 100, id }
      const state = getPaginator({ pagination: reducer(initialState, action) }, id)

      expect(state.get('page')).toEqual(action.page)
    })

    it('handles SET_PAGE_SIZE', () => {
      const { state: initialState } = setup()
      const action = { type: actionTypes.SET_PAGE_SIZE, page: 2, id }
      const state = getPaginator({ pagination: reducer(initialState, action) }, id)

      expect(state).toEqual(defaultPaginator.merge({
        page: 1,
        pageSize: action.size,
        id
      }))
    })

    it('handles FETCH_RECORDS', () => {
      const { state: initialState } = setup()
      const action = { type: actionTypes.FETCH_RECORDS, id }
      const state = getPaginator({ pagination: reducer(initialState, action) }, id)

      expect(state.get('isLoading')).toBe(true)
    })

    it('handles RESULTS_UPDATED', () => {
      const requestId = 'someId'
      const paginator = defaultPaginator.merge({ requestId, isLoading: true })
      const { state: initialState } = setup(paginator)
      const records = [{ name: 'Pouty Stout' }, { name: 'Ewe and IPA' }]
      const action = {
        type: actionTypes.RESULTS_UPDATED,
        results: records,
        totalCount: 2,
        id,
        requestId
      }

      const state = getPaginator({ pagination: reducer(initialState, action) }, id)
      expect(state.toJS()).toEqual(defaultPaginator.merge({
        results: Immutable.fromJS(records),
        isLoading: false,
        totalCount: action.totalCount,
        requestId,
        id
      }).toJS())
    })

    it('handles RESULTS_UPDATED_ERROR', () => {
      const paginator = defaultPaginator.merge({ isLoading: true })
      const { state: initialState } = setup(paginator)
      const error = 'error'
      const action = {
        type: actionTypes.RESULTS_UPDATED_ERROR,
        error,
        id
      }

      const state = getPaginator({ pagination: reducer(initialState, action) }, id)
      expect(state.toJS()).toEqual(defaultPaginator.merge({
        isLoading: false,
        loadError: error,
        id
      }).toJS())
    })

    it('handles SET_FILTER', () => {
      const { state: initialState } = setup()
      const action = {
        type: actionTypes.SET_FILTER,
        field: 'base_salary',
        value: { lt: 2000 },
        id
      }

      const state = getPaginator({ pagination: reducer(initialState, action) }, id)
      expect(state.getIn(['filters', action.field])).toEqual(Immutable.fromJS(action.value))
    })

    it('handles SORT_CHANGED', () => {
      const paginator = defaultPaginator.merge({ sort: 'name', page: 2 })
      const { state: initialState } = setup(paginator)
      const action = {
        type: actionTypes.SORT_CHANGED,
        field: 'fermentation_temperature',
        reverse: true,
        id
      }

      const state = getPaginator({ pagination: reducer(initialState, action) }, id)
      expect(state.toJS()).toEqual(defaultPaginator.merge({
        sort: action.field,
        sortReverse: action.reverse,
        id
      }).toJS())
    })

    it('handles UPDATING_ALL', () => {
      const paginator = defaultPaginator.merge({
        results: [{ id: 1, name: 'Ewe and IPA' }]
      })

      const { state: initialState } = setup(paginator)

      const action = {
        type: actionTypes.UPDATING_ALL,
        id
      }

      const state = getPaginator({ pagination: reducer(initialState, action) }, id)
      expect(state.get('updating').toArray()).toInclude(1)
    })

    it('handles RESET_RESULTS', () => {
      const { state: initialState } = setup()
      const results = [1, 2, 3]
      const action = {
        type: actionTypes.RESET_RESULTS,
        results,
        id
      }

      const state = getPaginator({ pagination: reducer(initialState, action) }, id)
      expect(state.get('results').toJS()).toEqual(results)
    })

    context('when handling BULK_ERROR', () => {
      const paginator = defaultPaginator.merge({
        results: [{ id: 1, name: 'Ewe and IPA' }]
      })

      const { state: initialState } = setup(paginator)
      const error = 'server error'
      const action = {
        type: actionTypes.BULK_ERROR,
        error,
        id
      }

      const state = getPaginator({ pagination: reducer(initialState, action) }, id)
      const item = state.get('results').find(r => r.get('id') === 1)

      it('sets the error on all items', () => {
        expect(item.get('error')).toEqual(error)
      })

      it('clears the items from the updating list', () => {
        expect(state.get('updating').toArray()).toNotInclude(item.get('id'))
      })
    })

    context('when handling UPDATE_ALL', () => {
      const itemId = 'someId'
      const results = [{ id: itemId, name: 'Pouty Stout' }]
      const paginator = defaultPaginator.merge({
        results: Immutable.fromJS(results),
        updating: Set(itemId)
      })

      const { state: initialState } = setup(paginator)
      const action = {
        type: actionTypes.UPDATE_ALL,
        data: { active: true },
        id
      }

      const state = getPaginator({ pagination: reducer(initialState, action) }, id)

      it('updates all items', () => {
        const items = state.get('results')
        expect(items.every(i => i.get('active'))).toBe(true)
      })

      it('removes the item from the updating list', () => {
        expect(state.get('updating').toArray()).toNotInclude(itemId)
      })

      it('clears the bulkUpdateError', () => {
        expect(state.get('bulkUpdateError')).toNotExist()
      })
    })

    it('handles UPDATING_ITEM', () => {
      const { state: initialState } = setup()
      const action = {
        type: actionTypes.UPDATING_ITEM,
        itemId: 'someId',
        id
      }

      const state = getPaginator({ pagination: reducer(initialState, action) }, id)
      expect(state.get('updating').toJS()).toInclude(action.itemId)
    })

    context('when handling UPDATE_ITEM', () => {
      const itemId = 'someId'
      const results = [{ id: itemId, name: 'Pouty Stout', error: 'Error updating recipe' }]
      const updating = Set.of('someId')
      const paginator = defaultPaginator.merge({ results: Immutable.fromJS(results), updating })
      const { state: initialState } = setup(paginator)
      const action = {
        type: actionTypes.UPDATE_ITEM,
        data: { name: 'Ewe and IPA' },
        itemId,
        id
      }

      const state = getPaginator({ pagination: reducer(initialState, action) }, id)

      it('updates the item', () => {
        const item = state.get('results').toJS()[0]
        expect(item.name).toEqual(action.data.name)
      })

      it('removes the item from the updating list', () => {
        expect(state.get('updating').toJS()).toNotInclude(itemId)
      })

      it('removes the error from the item', () => {
        expect(state.get('error')).toNotExist()
      })
    })

    it('handles REMOVING_ITEM', () => {
      const { state: initialState } = setup()
      const action = {
        type: actionTypes.REMOVING_ITEM,
        itemId: 'someId',
        id
      }

      const state = getPaginator({ pagination: reducer(initialState, action) }, id)
      expect(state.get('removing').toJS()).toInclude(action.itemId)
    })

    it('handles REMOVE_ITEM', () => {
      const itemId = 'someId'
      const results = [{ id: itemId, name: 'Pouty Stout' }]
      const removing = Set.of(itemId)
      const paginator = defaultPaginator.merge({ results: Immutable.fromJS(results), removing })
      const { state: initialState } = setup(paginator)
      const action = {
        type: actionTypes.REMOVE_ITEM,
        itemId,
        id
      }

      const state = getPaginator({ pagination: reducer(initialState, action) }, id)

      it('removes the item', () => {
        expect(state.get('results').count()).toEqual(0)
      })

      it('removes the item from the removing list', () => {
        expect(state.get('removing').toJS()).toNotInclude(itemId)
      })
    })

    it('handles ITEM_ERROR', () => {
      const itemId = 'someId'
      const results = [{ id: itemId, name: 'Pouty Stout' }]
      const updating = Set.of(itemId)
      const paginator = defaultPaginator.merge({ results: Immutable.fromJS(results), updating })
      const { state: initialState } = setup(paginator)
      const action = {
        type: actionTypes.ITEM_ERROR,
        itemId,
        id,
        error: 'Error updating item'
      }

      const state = getPaginator({ pagination: reducer(initialState, action) }, id)
      const item = state.get('results').find(r => r.get('id') === itemId)

      it('attaches the error to the item', () => {
        expect(item.get('error')).toEqual(action.error)
      })

      it('removes the item from the updating list', () => {
        expect(state.get('updating').toJS()).toNotInclude(itemId)
      })
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

          const state = getPaginator({ pagination: reducer(initialState, action) }, id)
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

          const state = getPaginator({ pagination: reducer(initialState, action) }, id)
          expect(state.getIn(['filters', 'myArray']).toArray()).toInclude('myItem')
        })
      })
    })
  })
})

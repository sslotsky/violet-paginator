import React from 'react'
import expect from 'expect'
import { mount } from 'enzyme'
import { PaginationWrapper } from '../../src/containers/PaginationWrapper'
import { defaultPaginator } from '../../src/reducer'
import '../specHelper'
import { registerPaginator } from '../../src/lib/stateManagement'

const MockComponent = () => false

function getProps(props = {}) {
  return {
    pageActions: {
      reload: expect.createSpy(),
      initialize: expect.createSpy()
    },
    paginator: defaultPaginator.merge(props)
  }
}

describe('<PaginationWrapper />', () => {
  context('when caching is used', () => {
    beforeEach(() => {
      registerPaginator({ listId: 'mockList', cache: true })
    })

    context('when stale', () => {
      const props = getProps({ initialized: true, stale: true })

      beforeEach(() => {
        mount(
          <PaginationWrapper {...props} listId="mockList">
            <MockComponent />
          </PaginationWrapper>
        )
      })

      it('reloads', () => {
        expect(props.pageActions.reload).toHaveBeenCalled()
      })
    })

    context('when not stale', () => {
      const props = getProps({ initialized: true, stale: false })

      beforeEach(() => {
        mount(
          <PaginationWrapper {...props} listId="mockList">
            <MockComponent />
          </PaginationWrapper>
        )
      })

      it('does not reload', () => {
        expect(props.pageActions.reload).toNotHaveBeenCalled()
      })
    })
  })

  context('when paginator is uninitialized', () => {
    const props = getProps()
    mount(
      <PaginationWrapper {...props}>
        <MockComponent />
      </PaginationWrapper>
    )

    it('calls initialize', () => {
      expect(props.pageActions.initialize).toHaveBeenCalled()
    })
  })

  context('when paginator is initialized', () => {
    const props = getProps({ initialized: true })
    mount(
      <PaginationWrapper {...props}>
        <MockComponent />
      </PaginationWrapper>
    )

    it('does not initialize', () => {
      expect(props.pageActions.initialize).toNotHaveBeenCalled()
    })
  })

  context('when paginator is stale', () => {
    context('and there is no load error', () => {
      const props = getProps({ stale: true, initialized: true })
      mount(
        <PaginationWrapper {...props}>
          <MockComponent />
        </PaginationWrapper>
      )

      it('executes a reload', () => {
        expect(props.pageActions.reload).toHaveBeenCalled()
      })
    })

    context('and there is a load error', () => {
      const props = getProps({
        stale: true,
        loadError: { status: 401 }
      })

      mount(
        <PaginationWrapper {...props}>
          <MockComponent />
        </PaginationWrapper>
      )

      it('does not execute a reload', () => {
        expect(props.pageActions.reload).toNotHaveBeenCalled()
      })
    })
  })
})

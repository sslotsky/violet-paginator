import React from 'react'
import expect from 'expect'
import { shallow } from 'enzyme'
import connect from '../../src/flux/connect'
import * as flux from '../../src/flux/flux'

function initialize() {
  const unsubscribe = expect.createSpy()
  const mockStore = {
    subscribe: expect.createSpy().andReturn(unsubscribe),
    getState: () => {}
  }

  expect.spyOn(flux, 'getFlux').andReturn(mockStore)

  return { mockStore, unsubscribe }
}

const Mock = () => false
const Wrapped = connect()(Mock)

describe('connect', () => {
  beforeEach(() => expect.restoreSpies())
  context('on mount', () => {
    const { mockStore } = initialize()
    const wrapper = shallow(<Wrapped />)
    wrapper.instance().componentDidMount()

    it('subscribes to the store', () => {
      expect(mockStore.subscribe).toHaveBeenCalledWith(wrapper.instance().notify)
    })
  })

  context('on unmount', () => {
    const { unsubscribe } = initialize()
    const wrapper = shallow(<Wrapped />)
    wrapper.instance().componentDidMount()
    wrapper.instance().componentWillUnmount()

    it('unsubscribes from the store', () => {
      expect(unsubscribe).toHaveBeenCalled()
    })
  })
})

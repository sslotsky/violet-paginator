import React from 'react'
import expect from 'expect'
import { shallow } from 'enzyme'
import FontAwesome from 'react-fontawesome'
import { Prev } from '../src/Prev'

function verifyIcon(node) {
  const {
    type,
    props: { name }
  } = node

  expect([
    type,
    name
  ]).toEqual([
    FontAwesome,
    'chevron-left'
  ])
}

describe('<Prev />', () => {
  context('when no previous page exists', () => {
    const wrapper = shallow(
      <Prev actions={{}} />
    )

    it('renders an icon', () => {
      verifyIcon(wrapper.node)
    })
  })

  context('when previous page exists', () => {
    const actions = {
      prev: expect.createSpy()
    }

    const wrapper = shallow(
      <Prev actions={actions} hasPreviousPage />
    )

    it('renders an anchor', () => {
      expect(wrapper.node.type).toEqual('a')
      expect(wrapper.find('a').length).toEqual(1)
    })

    it('renders an icon inside the anchor', () => {
      const icon = wrapper.node.props.children
      verifyIcon(icon)
    })

    context('when clicking the link', () => {
      wrapper.find('a').simulate('click')
      it('calls the prev action', () => {
        expect(actions.prev).toHaveBeenCalled()
      })
    })
  })
})

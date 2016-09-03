import React from 'react'
import expect from 'expect'
import { shallow } from 'enzyme'
import FontAwesome from 'react-fontawesome'
import { Next } from '../src/Next'

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
    'chevron-right'
  ])
}

describe('<Next />', () => {
  context('when no next page exists', () => {
    const wrapper = shallow(
      <Next actions={{}} />
    )

    it('renders an icon', () => {
      verifyIcon(wrapper.node)
    })
  })

  context('when next page exists', () => {
    const actions = {
      next: expect.createSpy()
    }

    const wrapper = shallow(
      <Next actions={actions} hasNextPage />
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
        expect(actions.next).toHaveBeenCalled()
      })
    })
  })
})


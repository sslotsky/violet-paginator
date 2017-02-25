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
      <Next pageActions={{}} />
    )

    it('disables the button', () => {
      expect(wrapper.props().disabled).toBe(true)
    })
  })

  context('when next page exists', () => {
    const pageActions = {
      next: expect.createSpy()
    }

    const wrapper = shallow(
      <Next pageActions={pageActions} hasNextPage />
    )

    it('renders a button', () => {
      expect(wrapper.node.type).toEqual('button')
    })

    it('renders an icon inside the button', () => {
      const icon = wrapper.node.props.children
      verifyIcon(icon)
    })

    context('when clicking the button', () => {
      wrapper.simulate('click')
      it('calls the prev action', () => {
        expect(pageActions.next).toHaveBeenCalled()
      })
    })
  })
})


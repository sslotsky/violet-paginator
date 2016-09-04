import React from 'react'
import expect from 'expect'
import { shallow } from 'enzyme'
import { PageLink } from '../src/PageLink'

function verifyPageNumber(node, pageNumber) {
  const { type, props: { children } } = node
  expect([
    type,
    children
  ]).toEqual([
    'span',
    pageNumber
  ])
}

describe('<PageLink />', () => {
  context('for the current page', () => {
    it('displays the page number in a span', () => {
      const wrapper = shallow(
        <PageLink page={1} currentPage={1} />
      )

      verifyPageNumber(wrapper.node, 1)
    })
  })

  context('for any other page', () => {
    const actions = { goTo: expect.createSpy() }
    const wrapper = shallow(
      <PageLink page={2} currentPage={1} actions={actions} />
    )

    it('displays a link', () => {
      expect(wrapper.node.type).toEqual('a')
    })

    it('displays the page number within the link', () => {
      const span = wrapper.node.props.children
      verifyPageNumber(span, 2)
    })

    context('when the link is clicked', () => {
      it('calls the goTo action', () => {
        wrapper.find('a').simulate('click')
        expect(actions.goTo).toHaveBeenCalledWith(2)
      })
    })
  })
})


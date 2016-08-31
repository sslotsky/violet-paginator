import React from 'react'
import FontAwesome from 'react-fontawesome'
import paginate from './PaginationWrapper'

export function Next({ actions, hasNextPage }) {
  const next = <FontAwesome name="chevron-right" />
  const link = hasNextPage ? (
    <a onClick={actions.next}>{next}</a>
  ) : next

  return link
}

export default paginate(Next)

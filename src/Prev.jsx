import React from 'react'
import FontAwesome from 'react-fontawesome'
import paginate from './PaginationWrapper'

export function Prev({ actions, hasPreviousPage }) {
  const prev = <FontAwesome name="chevron-left" />
  const link = hasPreviousPage ? (
    <a onClick={actions.prev}>{prev}</a>
  ) : prev

  return link
}

export default paginate(Prev)

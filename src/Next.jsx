import React, { PropTypes } from 'react'
import FontAwesome from 'react-fontawesome'
import { flip } from './decorators'

export function Next({ pageActions, hasNextPage }) {
  return (
    <button type="button" disabled={!hasNextPage} onClick={pageActions.next}>
      <FontAwesome name="chevron-right" />
    </button>
  )
}

Next.propTypes = {
  pageActions: PropTypes.shape({
    next: PropTypes.func.isRequired
  }).isRequired,
  hasNextPage: PropTypes.bool
}

export default flip(Next)

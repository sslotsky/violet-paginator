import React, { PropTypes } from 'react'
import FontAwesome from 'react-fontawesome'
import { flip } from './decorators'

export function Prev({ pageActions, hasPreviousPage }) {
  return (
    <button type="button" disabled={!hasPreviousPage} onClick={pageActions.prev}>
      <FontAwesome name="chevron-left" />
    </button>
  )
}

Prev.propTypes = {
  pageActions: PropTypes.shape({
    prev: PropTypes.func.isRequired
  }).isRequired,
  hasPreviousPage: PropTypes.bool
}

export default flip(Prev)

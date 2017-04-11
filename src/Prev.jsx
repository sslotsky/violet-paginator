import React from 'react'
import PropTypes from 'prop-types'
import { flip } from './decorators'

export function Prev({ pageActions, hasPreviousPage }) {
  return (
    <button type="button" disabled={!hasPreviousPage} onClick={pageActions.prev}>
      <i className="fa fa-chevron-left" />
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

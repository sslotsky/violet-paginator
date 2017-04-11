import React from 'react'
import PropTypes from 'prop-types'
import { withRecordProps } from '../decorators'

export default function DataRow({ component, ...rest }, context) {
  const Component = withRecordProps(component)

  return (
    <Component listId={context.listId} {...rest} />
  )
}

DataRow.propTypes = {
  component: PropTypes.func.isRequired
}

DataRow.contextTypes = {
  listId: PropTypes.string
}

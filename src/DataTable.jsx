import React from 'react'
import PropTypes from 'prop-types'
import classNames from './lib/classNames'
import ColumnHeader from './ColumnHeader'
import { tabulateLean } from './decorators'
import DataRow from './containers/DataRow'
import TableRow from './TableRow'

function renderRow(headers) {
  return (id, i) => (
    <DataRow
      key={i}
      itemId={id}
      component={TableRow}
      index={i}
      headers={headers}
    />
  )
}

export function DataTable(props) {
  const { ids, headers, isLoading, className = 'border' } = props

  const headerRow = headers.map(h =>
    <th key={h.field}>
      <ColumnHeader
        {...props}
        {...h}
      />
    </th>
  )

  const classes = classNames(className)
    .withConditional({ loading: isLoading })
    .load()

  return (
    <table className={classes}>
      <thead>
        <tr>
          {headerRow}
        </tr>
      </thead>
      <tbody>
        {ids.map(renderRow(headers))}
      </tbody>
    </table>
  )
}

DataTable.propTypes = {
  headers: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  ids: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])),
  className: PropTypes.string
}

export default tabulateLean(DataTable)

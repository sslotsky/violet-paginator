import React from 'react'
import PropTypes from 'prop-types'
import classNames from './lib/classNames'

export default function TableRow({ record, index, updating, removing, headers }) {
  const classes = classNames().withConditional({ updating, removing }).load()
  const columns = headers.map(h => {
    const { field, format } = h
    const data = record[field]
    const displayData = (format && format(record, index)) || data

    return (
      <td key={field}>
        {displayData}
      </td>
    )
  })

  return (
    <tr className={classes}>
      {columns}
    </tr>
  )
}

TableRow.propTypes = {
  record: PropTypes.object.isRequired,
  updating: PropTypes.bool,
  removing: PropTypes.bool,
  index: PropTypes.number.isRequired,
  headers: PropTypes.arrayOf(PropTypes.shape({
    format: PropTypes.func,
    field: PropTypes.string.isRequired
  })).isRequired
}

import React, { PropTypes } from 'react'
import FontAwesome from 'react-fontawesome'
import SortLink from './SortLink'
import { tabulate } from './decorators'
import { recordProps } from './pageInfoTranslator'
import DataRow from './containers/DataRow'
import TableRow from './TableRow'

function renderRow(headers) {
  return (r, i) => (
    <DataRow
      key={i}
      itemId={r[recordProps().identifier]}
      component={TableRow}
      index={i}
      headers={headers}
    />
  )
}

export function DataTable(props) {
  const { results, headers, isLoading, className = 'border' } = props

  if (isLoading) {
    return (
      <center>
        <FontAwesome
          name="spinner"
          spin
          size="5x"
        />
      </center>
    )
  }

  const headerRow = headers.map(h =>
    <th key={h.field}>
      <SortLink
        {...props}
        {...h}
      />
    </th>
  )

  return (
    <table className={className}>
      <thead>
        <tr>
          {headerRow}
        </tr>
      </thead>
      <tbody>
        {results.map(renderRow(headers))}
      </tbody>
    </table>
  )
}

DataTable.propTypes = {
  headers: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  results: PropTypes.arrayOf(PropTypes.object),
  className: PropTypes.string
}

export default tabulate(DataTable)

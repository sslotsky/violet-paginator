import React, { PropTypes } from 'react'
import FontAwesome from 'react-fontawesome'
import { SortLink } from './SortLink'
import paginate from './PaginationWrapper'

export function DataTable(props) {
  const { results, headers, isLoading } = props

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

  const rows = results.map((r, i) => {
    const columns = headers.map(h => {
      const { field, format } = h
      const data = r.get(field)
      const displayData = (format && format(r)) || data

      return (
        <td key={field}>
          {displayData}
        </td>
      )
    })

    return (
      <tr key={`results-${i}`}>
        {columns}
      </tr>
    )
  })

  return (
    <table className="border">
      <thead>
        <tr>
          {headerRow}
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>
  )
}

DataTable.propTypes = {
  headers: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  results: PropTypes.object
}

export default paginate(DataTable)

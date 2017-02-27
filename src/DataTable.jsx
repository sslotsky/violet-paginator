import React, { PropTypes, Component } from 'react'
import { List } from 'immutable'
import FontAwesome from 'react-fontawesome'
import SortLink from './SortLink'
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

export class DataTable extends Component {
  shouldComponentUpdate(nextProps) {
    return !this.props.ids.equals(nextProps.ids)
  }

  render() {
    const { ids, headers, isLoading, className = 'border' } = this.props

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
          {...this.props}
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
          {ids.map(renderRow(headers))}
        </tbody>
      </table>
    )
  }
}

DataTable.propTypes = {
  headers: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  ids: PropTypes.instanceOf(List),
  className: PropTypes.string
}

export default tabulateLean(DataTable)

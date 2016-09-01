import React, { PropTypes } from 'react'
import paginate from './PaginationWrapper'

const defaultOptions = [
  15,
  25,
  50,
  100
]

export function PageSizeDropdown({ pageSize, actions, options=defaultOptions }) {
  const optionTags = options.map(n =>
    <option key={n} value={n}>{n}</option>
  )

  const setPageSize = e =>
    actions.setPageSize(parseInt(e.target.value, 10))

  return (
    <select value={pageSize} onChange={setPageSize}>
      {optionTags}
    </select>
  )
}

PageSizeDropdown.propTypes = {
  pageSize: PropTypes.number,
  actions: PropTypes.object,
  options: PropTypes.array
}

export default paginate(PageSizeDropdown)

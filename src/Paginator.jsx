import React, { PropTypes } from 'react'
import classNames from 'classnames'

import paginate from './decorators/paginate'
import range from './lib/range'
import { PageNumber } from './PageNumber'
import { Prev } from './Prev'
import { Next } from './Next'

export function Paginator(props) {
  const { currentPage, totalPages } = props

  const hasRightEllipsis = totalPages - currentPage >= 7
  const hasLeftEllipsis = (totalPages > 7) && (currentPage > 2)
  const minPage = hasLeftEllipsis ? Math.min(currentPage, totalPages - 6) : 2
  const rangeSize = 7 - [hasRightEllipsis, hasLeftEllipsis].filter(h => h).length
  const maxPage = Math.max(minPage + 1, Math.min(totalPages - 1, minPage + (rangeSize - 1)))

  const pageLinks = totalPages > 2 && [...range(minPage, maxPage)].map(page => {
    const pageLinkClass = classNames({ current: page === currentPage })

    return (
      <li className={pageLinkClass} key={page}>
        <PageNumber {...props} page={page} />
      </li>
    )
  })

  const separator = (
    <li className="skip">
      <i className="fa fa-ellipsis-h" />
    </li>
  )

  const begin = (
    <li className={classNames({ current: currentPage === 1 })}>
      <PageNumber {...props} page={1} />
    </li>
  )

  const end = totalPages > 1 && (
    <li className={classNames({ current: currentPage === totalPages })}>
      <PageNumber {...props} page={totalPages} />
    </li>
  )

  return (
    <ul className="pagination">
      <li>
        <Prev {...props} />
      </li>
      {begin}
      {hasLeftEllipsis && separator}
      {pageLinks}
      {hasRightEllipsis && separator}
      {end}
      <li>
        <Next {...props} />
      </li>
    </ul>
  )
}

Paginator.propTypes = {
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  hasPreviousPage: PropTypes.bool,
  hasNextPage: PropTypes.bool
}

export default paginate(Paginator)

import React from 'react'
import PropTypes from 'prop-types'
import classNames from './lib/classNames'

import paginate from './decorators/paginate'
import pageData from './pageData'
import { PageNumber } from './PageNumber'
import { Prev } from './Prev'
import { Next } from './Next'

export function Paginator(props) {
  const { currentPage, totalPages } = props

  const { firstPage, hasLeftSeparator, middlePages, hasRightSeparator, lastPage } =
    pageData(currentPage, totalPages)

  const pageLinks = middlePages.map(({ page, current }) => {
    const pageLinkClass = classNames()
      .withConditional({ current })
      .load()

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
    <li className={classNames().withConditional({ current: firstPage.current }).load()}>
      <PageNumber {...props} page={firstPage.page} />
    </li>
  )

  const end = lastPage && (
    <li className={classNames().withConditional({ current: lastPage.current }).load()}>
      <PageNumber {...props} page={lastPage.page} />
    </li>
  )

  return (
    <ul className="pagination">
      <li>
        <Prev {...props} />
      </li>
      {begin}
      {hasLeftSeparator && separator}
      {pageLinks}
      {hasRightSeparator && separator}
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

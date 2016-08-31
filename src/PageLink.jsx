import React from 'react'
import paginate from './PaginationWrapper'

export function PageLink({ actions, page, currentPage }) {
  const navigate = () =>
    actions.goTo(page)

  const pageNumber = <span>{page}</span>
  const link = page === currentPage ? pageNumber : (
    <a onClick={navigate}>{pageNumber}</a>
  )

  return link
}

export default paginate(PageLink)


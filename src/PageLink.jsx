import React, { PropTypes } from 'react'
import { paginate } from './decorators'

export function PageLink({ pageActions, page, currentPage }) {
  const navigate = () =>
    pageActions.goTo(page)

  const pageNumber = <span>{page}</span>
  const link = page === currentPage ? pageNumber : (
    <button type="button" onClick={navigate}>{pageNumber}</button>
  )

  return link
}

PageLink.propTypes = {
  pageActions: PropTypes.shape({
    goTo: PropTypes.func.isRequired
  }).isRequired,
  page: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired
}

export default paginate(PageLink)


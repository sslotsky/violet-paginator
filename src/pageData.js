import range from './lib/range'

export default function pageData(currentPage, totalPages, maxPages = 7) {
  const hasRightSeparator = totalPages - currentPage >= maxPages
  const hasLeftSeparator = (totalPages > maxPages) && (currentPage > 2)
  const minPage = hasLeftSeparator ? Math.min(currentPage, totalPages - (maxPages - 1)) : 2
  const rangeSize = maxPages - [hasRightSeparator, hasLeftSeparator].filter(h => h).length
  const maxPage = Math.max(minPage + 1, Math.min(totalPages - 1, minPage + (rangeSize - 1)))

  const firstPage = {
    page: 1,
    current: currentPage === 1
  }

  const lastPage = totalPages > 1 && {
    page: totalPages,
    current: currentPage === totalPages
  }

  const middlePages = totalPages <= 2 ? [] : [...range(minPage, maxPage)].map(page => ({
    page,
    current: page === currentPage
  }))

  return { firstPage, hasLeftSeparator, middlePages, hasRightSeparator, lastPage }
}

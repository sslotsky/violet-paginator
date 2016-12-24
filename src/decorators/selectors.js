export default function select(paginator) {
  const totalPages =
    Math.ceil(paginator.get('totalCount') / paginator.get('pageSize'))

  const page = paginator.get('page')

  const flipper = () => ({
    hasPreviousPage: paginator.get('page') > 1,
    hasNextPage: page < totalPages
  })

  const fullPaginator = () => ({
    currentPage: page,
    totalPages,
    ...flipper()
  })

  const dataGrid = () => ({
    results: paginator.get('results'),
    isLoading: paginator.get('isLoading'),
    updating: paginator.get('updating'),
    removing: paginator.get('removing')
  })

  const pageSizer = () => ({
    pageSize: paginator.get('pageSize')
  })

  const sorter = () => ({
    sort: paginator.get('sort'),
    sortReverse: paginator.get('sortReverse')
  })

  const paginatedGrid = () => ({
    ...fullPaginator(),
    ...dataGrid(),
    ...pageSizer(),
    ...sorter()
  })

  return {
    flipper,
    fullPaginator,
    dataGrid,
    pageSizer,
    sorter,
    paginatedGrid
  }
}

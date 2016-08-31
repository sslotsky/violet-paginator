import React, { PropTypes } from 'react'
import FontAwesome from 'react-fontawesome'
import paginate from './PaginationWrapper'

export function SortLink({ paginator, actions, field, text, sortable=true }) {
  if (!sortable) {
    return <span>{text}</span>
  }

  const sort = () =>
    actions.sort(field, !paginator.get('sortReverse'))

  const arrow = paginator.get('sort') === field && (
    paginator.get('sortReverse') ? 'angle-up' : 'angle-down'
  )

  return (
    <a onClick={sort}>
      {text} <FontAwesome name={arrow || ''} />
    </a>
  )
}

SortLink.propTypes = {
  paginator: PropTypes.object,
  actions: PropTypes.object,
  field: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  sortable: PropTypes.bool
}

export default paginate(SortLink)


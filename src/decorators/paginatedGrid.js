import decorate from './decorate'
import select from './selectors'

export default function paginatedGrid(Component) {
  return decorate(Component, props => select(props.paginator).paginatedGrid())
}


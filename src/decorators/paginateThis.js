import decorate from './decorate'
import select from './selectors'

export default function paginateThis(Component) {
  return decorate(Component, props => select(props.paginator).paginateThis())
}


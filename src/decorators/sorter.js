import decorate from './decorate'
import select from './selectors'

export default function sorter(Component) {
  return decorate(Component, props => select(props.paginator).sorter())
}


import decorate from './decorate'
import select from './selectors'

export default function dataGrid(Component) {
  return decorate(Component, props => select(props.paginator).dataGrid())
}


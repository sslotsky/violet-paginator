import decorate from './decorate'
import select from './selectors'

export default function pageSizer(Component) {
  return decorate(Component, props => select(props.paginator).pageSizer())
}


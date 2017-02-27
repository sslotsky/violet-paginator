import decorate from './decorate'
import select from './selectors'

export default function tabulateLean(Component) {
  return decorate(Component, props => select(props.paginator).tabulateLean())
}


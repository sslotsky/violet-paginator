import React, { PropTypes, Component } from 'react'
import { List } from 'immutable'
import decorate from './decorate'
import select from './selectors'

export default function tabulateLean(Table) {
  class Controlled extends Component {
    static propTypes = {
      ids: PropTypes.instanceOf(List),
      shouldUpdate: PropTypes.func,
      isLoading: PropTypes.bool
    }

    static defaultProps = {
      shouldUpdate: () => false
    }

    shouldComponentUpdate(nextProps) {
      const { ids, isLoading, shouldUpdate } = this.props

      return !ids.equals(nextProps.ids) ||
        isLoading !== nextProps.isLoading ||
        shouldUpdate(this.props, nextProps)
    }

    render() {
      const { ids, ...rest } = this.props

      return (
        <Table ids={ids.toArray()} {...rest} />
      )
    }
  }

  return decorate(Controlled, props => select(props.paginator).tabulateLean())
}


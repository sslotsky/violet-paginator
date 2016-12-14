import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import register from './actions'
import { defaultPaginator } from './reducer'
import { preloadedPaginator } from './lib/stateManagement'

const connector = connect(
  (state, ownProps) => ({
    paginator: preloadedPaginator(state, ownProps.listId, ownProps.preloaded)
  }),
  (dispatch, ownProps) => ({
    actions: bindActionCreators(register(ownProps), dispatch)
  })
)

export class PaginationWrapper extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    paginator: PropTypes.object,
    children: PropTypes.element.isRequired
  }

  static defaultProps = {
    paginator: defaultPaginator
  }

  componentDidMount() {
    this.props.actions.initialize()
    this.reloadIfStale(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.reloadIfStale(nextProps)
  }

  reloadIfStale(props) {
    const { paginator, actions } = props
    if (paginator.get('stale') && !paginator.get('isLoading') && !paginator.get('loadError')) {
      actions.reload()
    }
  }

  render() {
    return this.props.children
  }
}

function info(paginator) {
  const totalPages =
    Math.ceil(paginator.get('totalCount') / paginator.get('pageSize'))

  return {
    hasPreviousPage: paginator.get('page') > 1,
    hasNextPage: paginator.get('page') < totalPages,
    currentPage: paginator.get('page'),
    pageSize: paginator.get('pageSize'),
    results: paginator.get('results'),
    isLoading: paginator.get('isLoading'),
    updating: paginator.get('updating'),
    removing: paginator.get('removing'),
    totalPages
  }
}

export default function paginate(ComponentClass) {
  return connector(props => (
    <PaginationWrapper {...props}>
      <ComponentClass {...props} {...info(props.paginator)} />
    </PaginationWrapper>
  ))
}

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

export default function paginate(ComponentClass) {
  return connector(
    class extends Component {
      static propTypes = {
        actions: PropTypes.object.isRequired,
        paginator: PropTypes.object
      }

      static defaultProps = {
        paginator: defaultPaginator
      }

      reloadIfStale(props) {
        const { paginator, actions } = props
        if (paginator.get('stale') && !paginator.get('isLoading')) {
          actions.reload()
        }
      }

      componentDidMount() {
        this.props.actions.initialize()
        this.reloadIfStale(this.props)
      }

      componentWillReceiveProps(nextProps) {
        this.reloadIfStale(nextProps)
      }

      info() {
        const { paginator } = this.props
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

      render() {
        return <ComponentClass {...this.props} {...this.info()} />
      }
    }
  )
}

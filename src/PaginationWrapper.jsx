import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import register from './actions'
import { defaultPaginator } from './reducer'

const connector = connect(
  (state, ownProps) => ({
    paginator: state.pagination.find(p => p.get('id') === ownProps.listId)
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

      componentDidMount() {
        this.props.actions.initialize()
      }

      info() {
        const { paginator } = this.props
        const totalPages =
          Math.ceil(paginator.get('totalCount') / paginator.get('pageSize'))

        return {
          hasPreviousPage: paginator.get('page') > 1,
          hasNextPage: paginator.get('page') < totalPages,
          currentPage: paginator.get('page'),
          results: paginator.get('results'),
          isLoading: paginator.get('isLoading'),
          totalPages
        }
      }

      render() {
        return <ComponentClass {...this.props} {...this.info()} />
      }
    }
  )
}

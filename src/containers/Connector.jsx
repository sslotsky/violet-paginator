import React, { PropTypes, Component } from 'react';
import { createStore } from '../store';
import { bindActions } from '../flux';

const store = createStore()

function resolveActions(props, actionSelect) {
  if (typeof(actionSelect) === 'function') {
    return actionSelect(store.dispatch, props)
  }

  return bindActions(actionSelect)
}

export default function connect(propSelect, actionSelect = {}) {
  return Comp => class extends Component {
    notify = () => this.setState(store.getState())

    componentDidMount() {
      store.subscribe(this.notify)
    }

    componentWillUnmount() {
      store.unsubscribe(this.notify)
    }

    render() {
      return (
        <Comp
          {...this.props}
          {...propSelect(store.getState(), this.props)}
          {...resolveActions(this.props, actionSelect)}
        />
      )
    }
  }
}

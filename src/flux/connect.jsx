import React, { Component } from 'react'
import { getFlux, bindActions } from './flux'

function resolveActions(props, actionSelect) {
  if (typeof (actionSelect) === 'function') {
    return actionSelect(getFlux().dispatch, props)
  }

  return bindActions(actionSelect)
}

export default function connect(propSelect, actionSelect = {}) {
  return Comp => class extends Component {
    notify = () => {
      if (this.shouldUpdate) {
        this.setState(getFlux().getState())
      }
    }

    componentDidMount() {
      this.unsubscribe = getFlux().subscribe(this.notify)
      this.shouldUpdate = true
    }

    componentWillUnmount() {
      this.unsubscribe()
      this.shouldUpdate = false
    }

    render() {
      return (
        <Comp
          {...this.props}
          {...propSelect(getFlux().getState(), this.props)}
          {...resolveActions(this.props, actionSelect)}
        />
      )
    }
  }
}

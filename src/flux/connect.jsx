import React, { Component } from 'react'
import resolveActions from './resolveActions'
import { getFlux } from './flux'

export default function connect(propSelect = () => ({}), actionSelect = {}) {
  return Comp => class extends Component {
    notify = () => {
      if (this.shouldUpdate) {
        this.setState(getFlux().getState())
      }
    }

    componentDidMount() {
      this.unsubscribe = getFlux().subscribe(this.notify)
      this.shouldUpdate = true
      this.forceUpdate()
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

import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as RandomActions from '../actions/random'

class App extends Component {
  render () {
    const { actions, isWaiting, number } = this.props
    return (
      <div>
        <button onClick={actions.randomNumberInRandomTime}>
          Get a random number in a random time (5s max)
        </button>

        {
          isWaiting
            ? <p>Waiting for result</p>
            : <p>Completed in {number}s</p>
        }
      </div>
    )
  }
}

App.propTypes = {
  actions: PropTypes.object.isRequired,
  isWaiting: PropTypes.bool,
  number: PropTypes.number
}

function mapStateToProps (state) {
  return { ...state.random }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(RandomActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

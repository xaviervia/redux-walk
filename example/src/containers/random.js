import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as RandomActions from '../actions/random'

class App extends Component {
  render () {
    const { actions, isWaiting, number, congratulations } = this.props
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

        <p>{ congratulations }</p>

        <button onClick={actions.randomHalfTimesItWorks}>Try your luck</button>
      </div>
    )
  }
}

App.propTypes = {
  actions: PropTypes.object.isRequired,
  isWaiting: PropTypes.bool,
  number: PropTypes.number,
  congratulations: PropTypes.string
}

function mapStateToProps ({ congratulations, random}) {
  return { ...random, congratulations }
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

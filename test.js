var example = require('washington')
var createWalkMiddleware = require('./index')

var func = function () {}

example('@walk forwards the action', function (check) {
  var next = function next (action) { next.action = action }
  var action = {
    type: 'SOME_ACTION',
    payload: undefined
  }

  var walkMiddleware = createWalkMiddleware(function () {})

  walkMiddleware({
    dispatch: function () {},
    getState: function () {}
  })(next)(action)

  check(next.action, action)
})

example('rootWalk called with the state and the action', function (check) {
  var action = { type: 'SOME_ACTION' }
  var rootWalk = function rootWalk (state, action) {
    rootWalk.action = action
    rootWalk.state = state
  }
  var state = { the: 'state' }
  createWalkMiddleware(rootWalk)
    ({ dispatch: func, getState: function () { return state } })(func)(action)

  check(
    rootWalk.action === action &&
    rootWalk.state === state
  )
})

example('rootWalk return used to dispatch the walk result', function (check) {
  var payload = { the: 'payload' }
  var walk = {
    through: function (callback) { callback(payload) },
    to: function (result) { return result }
  }
  var rootWalk = function () { return walk }
  var walkMiddleware = createWalkMiddleware(rootWalk)
  var dispatch = function dispatch (result) { dispatch.result = result }
  walkMiddleware({
    dispatch: dispatch,
    getState: func
  })(func)({ type: 'SOME_ACTION' })

  check(dispatch.result, payload)
})

example('if no through function, dispatches the target with the payload directly', function (check) {
  var payload = { the: 'payload' }
  var walk = {
    to: function (result) { return result }
  }
  var walkMiddleware = createWalkMiddleware(function () { return walk })
  var dispatch = function dispatch (result) { dispatch.result = result }
  walkMiddleware({
    dispatch: dispatch,
    getState: func
  })(func)({ type: 'SOME_ACTION', payload: payload })

  check(dispatch.result, payload)
})

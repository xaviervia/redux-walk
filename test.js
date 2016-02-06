var example = require('washington')
var createWalkMiddleware = require('./index')

var func = function () {}
var emptyWalk = { through: func, to: func }

example('@walk forwards the action', function (check) {
  var next = function next (action) { next.action = action }
  var action = {
    type: 'SOME_ACTION',
    payload: undefined
  }

  var walkMiddleware = createWalkMiddleware(function () {
    return emptyWalk
  })

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
    return emptyWalk
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

// example('@walk action dispatches the result of the walk', function (check) {
//   var payload = { the: 'payload' }
//   var through = function (callback) { callback(payload) }
//   var to = function (payload) { re }
//   var rootWalk = function rootWalk (action) {
//     rootWalk.action = action
//
//     return {
//       through: function (callback) { callback(payload) },
//       to: function (payload) { return payload }
//     }
//   }
//   var walkMiddleware = createWalkMiddleware(function () {
//     return {
//       through: through,
//       to:
//     }
//   })
//   // var next = function () {}
//   // var theResult = { key: 'value' }
//   // var mainWalk = function (callback) {
//   //   setTimeout(function () {
//   //     callback(theResult)
//   //   })
//   // }
//   // var mainCompleted = function mainCompleted (result) {
//   //   return result
//   // }
//   // var mainAction = {
//   //   type: 'MAIN',
//   //   payload: undefined,
//   //   walk: {
//   //     through: mainWalk,
//   //     to: mainCompleted
//   //   }
//   // }
//   // var dispatch = function dispatch (result) {
//   //   check(theResult, result)
//   // }
//   //
//   // walk({ dispatch: dispatch })(next)(mainAction)
// })

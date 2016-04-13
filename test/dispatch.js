var spec = require('washington')
var createWalkMiddleware = require('../index')

function stub () { return function f (x) { f.payload = x } }

spec('calls the meta.walk with the current state and the getState function', function (check) {
  var currentState = { the: 'current state' }

  var walkCreator = function () { return { continue: function () {} } }
  var context = {
    dispatch: function () {},
    getState: function () { return currentState }
  }
  var next = function () {}
  var action = {
    type: 'THE_ACTION',
    meta: {
      walk: function f (prevState, getState) {
        f.prevState = prevState
        f.getState = getState

        return function () {}
      }
    }
  }

  createWalkMiddleware(walkCreator)(context)(next)(action)

  setTimeout(function () {
    check(
      action.meta.walk.prevState === currentState &&
      action.meta.walk.getState === context.getState
    )
  })
})

spec('calls the callback with the corresponding payload when invoked from the meta.walk', function (check) {
  var payload = { the: 'payload' }
  var walk = { continue: stub() }

  var walkCreator = function () { return walk }
  var context = { dispatch: function () {}, getState: function () {} }
  var next = function () {}
  var action = {
    type: 'THE_ACTION',
    meta: {
      walk: function () {
        return function (walk) {
          walk.continue(payload)
        }
      }
    }
  }

  createWalkMiddleware(walkCreator)(context)(next)(action)

  setTimeout(function () {
    check(
      walk.continue.payload,
      payload
    )
  })
})

spec('dispatches the action created by the invoked callback of the walk', function (check) {
  var subsequentAction = { type: 'SUBSEQUENT_ACTION' }
  var walk = { continue: function () { return subsequentAction } }

  var walkCreator = function () { return walk }
  var context = { dispatch: stub(), getState: function () {} }
  var next = function () {}
  var action = {
    type: 'THE_ACTION',
    meta: {
      walk: function () {
        return function (walk) {
          walk.continue()
        }
      }
    }
  }

  createWalkMiddleware(walkCreator)(context)(next)(action)

  setTimeout(function () {
    check(
      context.dispatch.payload,
      subsequentAction
    )
  })
})

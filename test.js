var example = require('washington')
var walk = require('./index')

example('@walk forwards the action', function (done) {
  var next = function next (action) { next.action = action }
  var action = {
    type: 'SOME_ACTION',
    payload: 'not a walk'
  }

  walk({ dispatch: function () {} })(next)(action)

  done(next.action, action)
})

example('@walk action dispatches the result of the walk', function (done) {
  var next = function () {}
  var theResult = { key: 'value' }
  var mainWalk = function (callback) {
    setTimeout(function () {
      callback(theResult)
    })
  }
  var mainCompleted = function mainCompleted (result) {
    return result
  }
  var mainAction = {
    type: 'MAIN',
    payload: undefined,
    walk: {
      through: mainWalk,
      to: mainCompleted
    }
  }
  var dispatch = function dispatch (result) {
    done(theResult, result)
  }

  walk({ dispatch: dispatch })(next)(mainAction)
})

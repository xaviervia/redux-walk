var spec = require('washington')
var createWalkMiddleware = require('../index')

function stub () { return function f (x) { f.payload = x } }

spec('forwards the action', function (check) {
  var walkCreator = function () {}
  var context = { dispatch: function () {}, getState: function () {} }
  var next = stub()
  var action = { type: 'THE_ACTION', payload: { the: 'payload' } }

  createWalkMiddleware(walkCreator)(context)(next)(action)

  check(next.payload, action)
})

spec('passes the action to the walkCreator', function (check) {
  var walkCreator = function f (x) {
    f.payload = x
    return {}
  }
  var context = { dispatch: function () {}, getState: function () {} }
  var next = function () {}
  var action = {
    type: 'THE_ACTION',
    payload: { the: 'payload' },
    meta: { walk: function () { return function () {} } }
 }

  createWalkMiddleware(walkCreator)(context)(next)(action)

  check(walkCreator.payload, action)
})

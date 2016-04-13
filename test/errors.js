var spec = require('washington')
var createWalkMiddleware = require('../index')

function stub () { return function f (x) { f.payload = x } }
var context = { dispatch: function () {}, getState: function () {} }
var next = function () {}

spec('fails when meta.walk is not a function', function (check) {
  var walkCreator = function () {}
  var action = {
    type: 'WITH_WRONG_WALK',
    meta: {
      walk: {}
    }
  }

  try {
    createWalkMiddleware(walkCreator)(context)(next)(action)
  } catch (error) {
    check(
      error.message,
      'meta.walk property in action `WITH_WRONG_WALK` needs to be a function'
    )
  }
})

spec('fails when there a meta.walk but no walk', function (check) {
  var walkCreator = function () {}
  var action = {
    type: 'WITH_WALK',
    meta: {
      walk: function () {}
    }
  }

  try {
    createWalkMiddleware(walkCreator)(context)(next)(action)
  } catch (error) {
    check(
      error.message,
      'There is no corresponding walk for action `WITH_WALK`'
    )
  }
})

spec('fails if the meta.walk, when invoked, does not immediatly return a function', function (check) {
  var walkCreator = function () { return {} }
  var action = {
    type: 'WITH_ALMOST_OK_WALK',
    meta: {
      walk: function () {}
    }
  }

  try {
    createWalkMiddleware(walkCreator)(context)(next)(action)
  } catch (error) {
    check(
      error.message,
      'The meta.walk in action `WITH_ALMOST_OK_WALK` must return a function'
    )
  }
})

spec('fails when the walk is not an object', function (check) {
  var walkCreator = function () { return 'not an object' }
  var action = { type: 'THE_ACTION', meta: { walk: function () { return function () {} } } }

  try {
    createWalkMiddleware(walkCreator)(context)(next)(action)
  } catch (error) {
    check(
      error.message,
      'The walk for `THE_ACTION` must be an object'
    )
  }
})

spec('fails when one of the properties of the walk is not a function', function (check) {
  var walkCreator = function () { return { continue: 'not a function' } }
  var action = { type: 'THE_ACTION', meta: { walk: function () { return function () {} } } }

  try {
    createWalkMiddleware(walkCreator)(context)(next)(action)
  } catch (error) {
    check(
      error.message,
      'Expected callback `continue` of the walk for `THE_ACTION` to be a function'
    )
  }
})

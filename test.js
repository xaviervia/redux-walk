var example = require('washington')
var createWalkMiddleware = require('./index')

function func () {}
function stub () { return function f (x) { f.payload = x } }
function identity (x) { return function () { return x } }
function pipe () { return function (x) { return x } }
function dispatcher (f) { return { dispatch: f } }
function selfResolve (x) { return function (ok) { ok(x) } }
function selfReject (x) { return function (_, no) { no(x) } }
function someAction () { return { type: 'SOME_ACTION' } }
function withPromise (a) {
  return function (p) { return Object.assign({}, a, { meta: { promise: p } }) }
}
function withPayload (a) {
  return function (p) { return Object.assign({}, a, { payload: p }) }
}

example('it forwards the action', function (check) {
  var next = stub()
  var action = someAction()

  createWalkMiddleware(func)(dispatcher())(next)(action)

  check(next.payload, action)
})

example('walk @creator called with the action', function (check) {
  var walkCreator = stub()
  var action = someAction()

  createWalkMiddleware(walkCreator)(dispatcher())(func)(action)

  check(walkCreator.payload, action)
})

example('@direct if object instead of callback, throws an exception', function (check) {
  try {
    createWalkMiddleware(identity({}))(dispatcher())(func)(someAction())
  } catch (error) {
    check(error.message, 'Expected function as target in walk for action \'SOME_ACTION\'')
  }
})

example('@direct dispatches the action with the payload', function (check) {
  var action = withPayload(someAction())({ key: 'value' })
  var dispatch = stub()
  createWalkMiddleware(identity(pipe()))(dispatcher(dispatch))(func)(action)

  check(dispatch.payload, action.payload)
})

example('@promise if there is no walk, throws an exception', function (check) {
  var action = withPromise(someAction())({})

  try {
    createWalkMiddleware(func)(dispatcher())(func)(action)
  } catch (error) {
    check(error.message, 'Found promise in \'SOME_ACTION\' but there is no walk for it')
  }
})

example('@promise if walk is not function and has no `resolve` or `reject`, throws an exception', function (check) {
  var action = withPromise(someAction())({})

  try {
    createWalkMiddleware(identity({}))(dispatcher())(func)(action)
  } catch (error) {
    check(error.message, 'The walk for \'SOME_ACTION\' needs to be a callback, or to have a `resolve` or/and `reject` callback when there is a promise in it')
  }
})

example('@promise @function if walk is callback, it dispatches when resolved with payload', function (check) {
  var payload = { key: 'value' }
  var action = withPromise(someAction())(selfResolve(payload))
  var dispatch = stub()

  createWalkMiddleware(identity(pipe()))(dispatcher(dispatch))(func)(action)

  check(dispatch.payload, payload)
})

example('@promise @object if walk is callback, it dispatches when resolved with payload', function (check) {
  var payload = { key: 'value' }
  var action = withPromise(someAction())(new Promise(selfResolve(payload)))
  var dispatch = stub()

  createWalkMiddleware(identity(pipe()))(dispatcher(dispatch))(func)(action)

  setTimeout(function () {
    check(dispatch.payload, payload)
  })
})

example('@promise @function if walk is callback, it dispatches when rejected with payload', function (check) {
  var payload = { key: 'value' }
  var action = withPromise(someAction())(selfReject(payload))
  var dispatch = stub()

  createWalkMiddleware(identity(pipe()))(dispatcher(dispatch))(func)(action)

  check(dispatch.payload, payload)
})

example('@promise @object if walk is callback, it dispatches when rejected with payload', function (check) {
  var payload = { key: 'value' }
  var action = withPromise(someAction())(new Promise(selfReject(payload)))
  var dispatch = stub()

  createWalkMiddleware(identity(pipe()))(dispatcher(dispatch))(func)(action)

  setTimeout(function () {
    check(dispatch.payload, payload)
  })
})

example('@promise @function if `resolve` callback, it dispatches when resolved with payload', function (check) {
  var payload = { key: 'value' }
  var action = withPromise(someAction())(selfResolve(payload))
  var dispatch = stub()

  createWalkMiddleware(identity({ resolve: pipe() }))
    (dispatcher(dispatch))(func)(action)

  check(dispatch.payload, payload)
})

example('@promise @object if `resolve` callback, it dispatches when resolved with payload', function (check) {
  var payload = { key: 'value' }
  var action = withPromise(someAction())(new Promise(selfResolve(payload)))
  var dispatch = stub()

  createWalkMiddleware(identity({ resolve: pipe() }))
    (dispatcher(dispatch))(func)(action)

  setTimeout(function () {
    check(dispatch.payload, payload)
  })
})

example('@promise @function if `reject` callback, it dispatches when rejected with payload', function (check) {
  var payload = { key: 'value' }
  var action = withPromise(someAction())(selfReject(payload))
  var dispatch = stub()

  createWalkMiddleware(identity({ reject: pipe() }))
    (dispatcher(dispatch))(func)(action)

  check(dispatch.payload, payload)
})

example('@promise @object if `reject` callback, it dispatches when rejected with payload', function (check) {
  var payload = { key: 'value' }
  var action = withPromise(someAction())(new Promise(selfReject(payload)))
  var dispatch = stub()

  createWalkMiddleware(identity({ reject: pipe() }))
    (dispatcher(dispatch))(func)(action)

  setTimeout(function () {
    check(dispatch.payload, payload)
  })
})

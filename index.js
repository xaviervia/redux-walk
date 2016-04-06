module.exports = function (walkCreator) {
  return function (context) {
    var dispatch = context.dispatch

    return function (next) {
      return function (action) {
        var walk = walkCreator(action)
        var dispatchWith = dispatcher(dispatch)(walk)

        findError(walk, action)(action.type)

        if (action.meta && action.meta.walk) {
          var resolve = dispatchWith(walk.resolve)
          var reject = dispatchWith(walk.reject)

          if (typeof action.meta.walk === 'function') {
            setTimeout(function () {
              action.meta.walk(function (error, result) {
                if (error != null) {
                  return reject(error)
                }

                resolve(result)
              })
            })
          } else {
            action.meta.walk.then(resolve)['catch'](reject)
          }
        } else if (walk) {
          setTimeout(function () {
            dispatchWith()(action.payload)
          })
        }

        next(action)
      }
    }
  }
}

var error = {
  promise: {
    noWalk: function (type) {
      throw new Error('Found promise in \'' + type + '\' but there is no walk for it')
    },
    missingCallback: function (type) {
      throw new Error('The walk for \'' + type + '\' needs to be a callback, or to have a `resolve` or/and `reject` callback when there is a promise in it')
    }
  },
  direct: {
    walkIsNotFunction: function (type) {
      throw new Error('Expected function as target in walk for action \'' + type + '\'')
    }
  }
}

function findError (walk, action) {
  if (action.meta && action.meta.walk) {
    if (!walk) {
      return error.promise.noWalk
    }

    if (typeof walk !== 'function' && walk.resolve == null && walk.reject == null) {
      return error.promise.missingCallback
    }
  } else if (walk && typeof walk !== 'function') {
    return error.direct.walkIsNotFunction
  }

  return function () {}
}

function dispatcher (dispatch) {
  return function (walk) {
    var fallbackWalk = typeof walk === 'function'
      ? function (payload) { dispatch(walk(payload)) }
      : function () {}

    return function (preferredWalk) {
      return typeof preferredWalk === 'function'
        ? function (payload) { dispatch(preferredWalk(payload)) }
        : fallbackWalk
    }
  }
}

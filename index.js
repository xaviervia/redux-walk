module.exports = function (walkCreator) {
  return function (context) {
    var dispatch = context.dispatch
    var getState = context.getState

    return function (next) {
      return function (action) {
        var walk = walkCreator(action)
        var dispatchWith = dispatcher(dispatch)(walk)

        if (action.meta && action.meta.walk && !walk) {
          throw new Error('Found walk in \'' + action.type + '\' but there is no walk for it')
        }

        var state = getState()

        var boundWalk = {}

        for (var key in walk) {
          if (walk.hasOwnProperty(key)) {
            // TODO: Add the validation for this to be action creators (or at least, functions)
            boundWalk[key] = dispatchWith(walk[key])
          }
        }

        if (action.meta && action.meta.walk) {
          if (typeof action.meta.walk === 'function') {
            setTimeout(function () {
              action.meta.walk({ prevState: state, getState: getState })(boundWalk)
            })
          } else {
            // TODO: Deal with this
            // This should die
            var resolve = dispatchWith(walk.resolve)
            var reject = dispatchWith(walk.reject)
            action.meta.walk(state, getState).then(resolve)['catch'](reject)
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

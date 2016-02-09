module.exports = function (walkCreator) {
  return function (context) {
    var dispatch = context.dispatch

    return function (next) {
      return function (action) {
        var walk = walkCreator(action)

        if (action.meta && action.meta.promise) {
          dispatchPromise(action.type, action.meta.promise, walk, dispatch)
        } else {
          dispatchDirect(action.type, action.payload, walk, dispatch)
        }

        //   if (walk.through) {
        //     walk.through(function (payload) { dispatch(walk.to(payload)) })
        //   } else {
        //     dispatch(walk.to(action.payload))
        //   }

        next(action)
      }
    }
  }
}

function dispatchPromise (type, promise, walk, dispatch) {
  if (!walk) {
    throw new Error('Found promise in \'' + type + '\' but there is no walk for it')
  }

  if (
    typeof walk !== 'function' &&
    walk.resolve == null &&
    walk.reject == null
  ) {
    throw new Error('The walk for \'' + type + '\' needs to have a `resolve` or/and `reject` callback when there is a promise in it')
  }

  if (typeof walk === 'function') {
    var all = function (payload) {
      dispatch(walk(payload))
    }
    if (typeof promise === 'function') {
      promise(all, all)
    } else {
      promise.then(all).catch(all)
    }
  } else {
    var resolve = walk.resolve ? function (payload) {
      dispatch(walk.resolve(payload))
    } : function () {}
    var reject = walk.reject ? function (payload) {
      dispatch(walk.reject(payload))
    } : function () {}

    if (typeof promise === 'function') {
      promise(resolve, reject)
    } else {
      promise.then(resolve).catch(reject)
    }
  }
}

function dispatchDirect (type, payload, walk, dispatch) {
  if (walk) {
    if (typeof walk !== 'function') {
      throw new Error('Expected function as target in walk for action \'' + type + '\'')
    }

    dispatch(walk(payload))
  }
}

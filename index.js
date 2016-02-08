module.exports = function (rootWalk) {
  return function (context) {
    var dispatch = context.dispatch
    var getState = context.getState

    return function (next) {
      return function (action) {
        var walk = rootWalk(getState(), action)

        if (walk) {
          if (walk.through) {
            walk.through(function (payload) { dispatch(walk.to(payload)) })
          } else {
            dispatch(walk.to(action.payload))
          }
        }

        next(action)
      }
    }
  }
}

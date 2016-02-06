module.exports = function (rootWalk) {
  return function (context) {
    var dispatch = context.dispatch
    var getState = context.getState

    return function (next) {
      return function (action) {
        var walk = rootWalk(getState(), action)

        walk.through(function (payload) { dispatch(walk.to(payload)) })

        next(action)
      }
    }
  }
}

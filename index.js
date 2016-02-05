module.exports = function (context) {
  var dispatch = context.dispatch

  return function (next) {
    return function (action) {
      if (action.walk) {
        action.walk.through(function (payload) {
          dispatch(action.walk.to(payload))
        })
      }

      next(action)
    }
  }
}

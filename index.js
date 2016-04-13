module.exports = function (walkCreator) {
  return function (context) {
    return function (next) {
      return function (action) {
        if (action.meta && action.meta.walk) {
          if (typeof action.meta.walk !== 'function') {
            throw new TypeError('meta.walk property in action `' + action.type + '` needs to be a function')
          }

          var walk = walkCreator(action)

          if (walk == null) {
            throw new Error('There is no corresponding walk for action `' + action.type + '`')
          }

          if (!(walk instanceof Object)) {
            throw new TypeError('The walk for `' + action.type + '` must be an object')
          }

          var partiallyAppliedMetaWalk = action.meta.walk(context.getState(), context.getState)

          if (typeof partiallyAppliedMetaWalk !== 'function') {
            throw new TypeError('The meta.walk in action `' + action.type + '` must return a function')
          }

          var boundWalk = {}
          for (var key in walk) {
            if (walk.hasOwnProperty(key)) {
              if (typeof walk[key] !== 'function') {
                throw new TypeError('Expected callback `' + key + '` of the walk for `' + action.type + '` to be a function')
              }

              boundWalk[key] = function () {
                var args = []

                for (var i = 0; i < arguments.length; i++) {
                  args.push(arguments[i])
                }

                context.dispatch(walk[key].apply(null, args))
              }
            }
          }

          partiallyAppliedMetaWalk(boundWalk)
        }

        next(action)
      }
    }
  }
}

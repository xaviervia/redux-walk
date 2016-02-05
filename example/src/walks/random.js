export const callBackInX = function (numberOfMilliseconds) {
  return function (done) {
    setTimeout(() => done(numberOfMilliseconds / 1000), numberOfMilliseconds)
  }
}

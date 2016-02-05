export const randomNumberInRandomTime = function () {
  const numberOfMilliseconds = Math.floor(Math.random() * 5000)
  return {
    type: 'RANDOM_NUMBER_IN_RANDOM_TIME',
    payload: numberOfMilliseconds
  }
}

export const randomNumberInRandomTimeReceived = function (numberOfMilliseconds) {
  return {
    type: 'RANDOM_NUMBER_IN_RANDOM_TIME_RECEIVED',
    payload: numberOfMilliseconds
  }
}

import * as RandomWalks from '../walks/random'

export const randomNumberInRandomTime = function () {
  const numberOfMilliseconds = Math.floor(Math.random() * 5000)
  return {
    type: 'RANDOM_NUMBER_IN_RANDOM_TIME',
    payload: numberOfMilliseconds,
    walk: {
      through: RandomWalks.callBackInX(numberOfMilliseconds),
      to: randomNumberInRandomTimeReceived
    }
  }
}

export const randomNumberInRandomTimeReceived = function (numberOfMilliseconds) {
  return {
    type: 'RANDOM_NUMBER_IN_RANDOM_TIME_RECEIVED',
    payload: numberOfMilliseconds
  }
}

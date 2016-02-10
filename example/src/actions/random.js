export const randomNumberInRandomTime = () => {
  const numberOfMilliseconds = Math.floor(Math.random() * 5000)
  return {
    type: 'RANDOM_NUMBER_IN_RANDOM_TIME',
    payload: numberOfMilliseconds,
    meta: {
      promise: (resolve, reject) => setTimeout(() => resolve(numberOfMilliseconds), numberOfMilliseconds)
    }
  }
}

export const randomNumberInRandomTimeReceived = (numberOfMilliseconds) => {
  type: 'RANDOM_NUMBER_IN_RANDOM_TIME_RECEIVED',
  payload: numberOfMilliseconds
}

export const randomHalfTimesItWorks = () => {
  return {
    type: 'RANDOM_HALF_TIMES_IT_WORKS',
    meta: {
      promise: new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.5) {
            resolve()
          } else {
            reject()
          }
        }, 1000)
      })
    }
  }
}

export const randomHalfTimesItWorksSuccess = () => { type: 'RANDOM_HALF_TIMES_IT_WORKS_SUCCESS' }

export const randomHalfTimesItWorksFailure = () => { type: 'RANDOM_HALF_TIMES_IT_WORKS_FAILURE' }

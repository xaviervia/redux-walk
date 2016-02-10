import * as RandomActions from '../actions/random'
import * as CongratulationsActions from '../actions/congratulations'

export default function walkCreator (result, { type, payload }) {
  switch (type) {
    case 'RANDOM_NUMBER_IN_RANDOM_TIME':
      return RandomActions.randomNumberInRandomTimeReceived

    case 'RANDOM_NUMBER_IN_RANDOM_TIME_RECEIVED':
      return CongratulationsActions.congratulationsShow

    case 'RANDOM_HALF_TIMES_IT_WORKS':
      return {
        resolve: RandomActions.randomHalfTimesItWorksSuccess,
        reject: RandomActions.randomHalfTimesItWorksFailure
      }
  }
}

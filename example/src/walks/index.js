import * as RandomActions from '../actions/random'

export default function (result, { type, payload }) {
  switch (type) {
    case 'RANDOM_NUMBER_IN_RANDOM_TIME':
      return RandomActions.randomNumberInRandomTimeReceived
    // case 'RANDOM_NUMBER_IN_RANDOM_TIME':
    //   return {
    //     resolved: RandomActions.randomNumberInRandomTimeReceived,
    //     rejected: RandomActions.randomNumberInRandomTimeReceivedFailure
    //   }
  }
}

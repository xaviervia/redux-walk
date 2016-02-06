import * as RandomActions from '../actions/random'

export default function (state, { type, payload }) {
  switch (type) {
    case 'RANDOM_NUMBER_IN_RANDOM_TIME':
      return {
        through: (done) => setTimeout(() => done(payload / 1000), payload),
        to: RandomActions.randomNumberInRandomTimeReceived
      }
  }

  return {
    through: () => {},
    to: () => {}
  }
}

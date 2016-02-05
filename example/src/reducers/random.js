const initialState = {
  number: 0,
  isWaiting: false
}

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case 'RANDOM_NUMBER_IN_RANDOM_TIME':
      return { ...state, isWaiting: true }
    case 'RANDOM_NUMBER_IN_RANDOM_TIME_RECEIVED':
      return { ...state, isWaiting: false, number: payload }
    default:
      return state
  }
}

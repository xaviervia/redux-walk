const initialState = {
  number: 0,
  isWaiting: false,
  isSuccess: undefined
}

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case 'RANDOM_NUMBER_IN_RANDOM_TIME':
      return { ...state, isWaiting: true }
    case 'RANDOM_NUMBER_IN_RANDOM_TIME_RECEIVED':
      return { ...state, isWaiting: false, number: payload }
    case 'RANDOM_HALF_TIMES_IT_WORKS_SUCCESS':
      return { ...state, isSuccess: true }
    case 'RANDOM_HALF_TIMES_IT_WORKS_FAILURE':
      return { ...state, isSuccess: false }
    default:
      return state
  }
}

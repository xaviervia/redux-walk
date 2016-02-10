const initialState = ''

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case 'CONGRATULATIONS_SHOW':
      return payload
  }
}

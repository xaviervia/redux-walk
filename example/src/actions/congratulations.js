export const congratulationsShow = (time) => {
  return {
    type: 'CONGRATULATIONS_SHOW',
    payload: time / 1000 + 's. Excellent time!'
  }
}

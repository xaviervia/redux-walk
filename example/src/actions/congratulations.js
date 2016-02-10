export const congratulationsShow = (time) => {
  type: 'CONGRATULATIONS_SHOW',
  payload: time / 1000 + 's. Excellent time!'
}

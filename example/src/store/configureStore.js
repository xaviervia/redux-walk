import { createStore, applyMiddleware } from 'redux'
import rootReducer from '../reducers'
import createLogger from 'redux-logger'
import walk from 'redux-walk'

export default function configureStore () {
  const logger = createLogger()
  const createStoreWithMiddleware = applyMiddleware(walk, logger)(createStore)
  const store = createStoreWithMiddleware(rootReducer, {})

  return store
}

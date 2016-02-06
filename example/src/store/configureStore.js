import { createStore, applyMiddleware } from 'redux'
import rootReducer from '../reducers'
import rootWalk from '../walks'
import createLogger from 'redux-logger'
import setupWalkMiddleware from 'redux-walk'

export default function configureStore () {
  const logger = createLogger()
  const walkMiddleware = setupWalkMiddleware(rootWalk)
  const createStoreWithMiddleware = applyMiddleware(walkMiddleware, logger)(createStore)
  const store = createStoreWithMiddleware(rootReducer, {})

  return store
}

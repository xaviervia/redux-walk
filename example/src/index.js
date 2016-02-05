import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import Random from './containers/random'
import configureStore from './store/configureStore'

import './index.scss'

const store = configureStore()

render(
  <Provider store={store}>
    <Random />
  </Provider>,
  document.getElementById('root')
)

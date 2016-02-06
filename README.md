# redux-walk

An async extension for Redux that keeps you functional

## Install

```sh
npm install --save redux-walk
```

## Example

Take a look at the [`example/src`](https://github.com/xaviervia/redux-walk/tree/master/example/src) folder for a very basic example. To try it out you can have it locally, or go to [xaviervia.github.io/redux-walk](http://xaviervia.github.io/redux-walk/)

```
git clone git://github.com/xaviervia/redux-walk
cd redux-walk
npm link
cd example
npm install
npm link redux-walk
npm start
```

> Don't forget to open the Chrome DevTools to see the Redux actions log

## How

The key concept is that of a Walk, which is essentially a function that receives a `done` callback which should be called when the asynchronous operation is completed, with the desired payload. In the example, the root walk is:

```js
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
```

Let's say that you want to perform an asynchronous operation when the action `RANDOM_NUMBER_IN_RANDOM_TIME` is created. The `redux-walk` middleware allows you to define a reducer-like structure for defining a _walk_ to be done from one action to the other, asynchronously. The Walk structure is composed of two functions:

- `through`: the function to be executed by the middleware with the `done` callback
- `to`: the action creator to be run when the walk is complete, which the middleware will then dispatch

Our actions are kept clean and vanilla. Nothing funky going on in here:

```js
export const randomNumberInRandomTime = function () {
  const numberOfMilliseconds = Math.floor(Math.random() * 5000)
  return {
    type: 'RANDOM_NUMBER_IN_RANDOM_TIME',
    payload: numberOfMilliseconds
  }
}

export const randomNumberInRandomTimeReceived = function (payload) {
  return {
    type: 'RANDOM_NUMBER_IN_RANDOM_TIME_RECEIVED',
    payload
  }
}
```

That's it! Simple, huh? And as a result, both the action creators and the walks are just functions, which can be tested with simplicity and consistency, just like regular synchronous functions would.

Don't forget to add the middleware to the store:

```js
import createWalkMiddleware from 'redux-walk'

import { createStore, applyMiddleware } from 'redux'
import rootReducer from '../reducers'
import rootWalk from '../walks'

export default function configureStore () {
  const walkMiddleware(rootWalk)
  const createStoreWithMiddleware = applyMiddleware(walkMiddleware, ...middlewares)(createStore)

  return createStoreWithMiddleware(rootReducer, {})
}
```

## Further justification

Besides the walks themselves, which do not affect anything outside them in the architecture, the Walk approach introduces no artifacts in your code:

- No weird `status` properties like in [`redux-promise`](https://www.npmjs.com/package/redux-promise)
- Actions are still actions, unlike in [`redux-thunk`](https://www.npmjs.com/package/redux-thunk)
- It's super flexible. Plug whatever you want as the walk function.

And the icing on the cake: you don't need to learn anything to use them! Walks are just pure functions, like reducers and action creators before them.

And it's only 16 lines of trivial code. Seriously. You could just copy paste it into your `configureStore` file instead.

## Test

```sh
git clone git://github.com/xaviervia/redux-walk
cd redux-walk
npm install
npm test
```

## License

Copyright 2016 Fernando Via Canel

ISC license.

See [LICENSE](LICENSE) attached.

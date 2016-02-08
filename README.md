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

The key concepts are:

- The rootWalk, which is a function that receives the state and the action (just like a reducer) and returns a Walk
- A Walk, which is an object with two keys:
  - `through`, a function that receives a `done` callback to be called with the resulting payload when the operation is completed.
  - `to`, an action creator which result the walk middleware will then dispatch

Let's say that you want to perform an asynchronous operation when the action `RANDOM_NUMBER_IN_RANDOM_TIME` is created. This is how the rootWalk in the example looks like:

```js
import * as RandomActions from '../actions/random'

export default function rootWalk (state, { type, payload }) {
  switch (type) {
    case 'RANDOM_NUMBER_IN_RANDOM_TIME':
      return {
        through: (done) => setTimeout(() => done(payload / 1000), payload),
        to: RandomActions.randomNumberInRandomTimeReceived
      }
  }
}
```

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
  const walkMiddleware = createWalkMiddleware(rootWalk)
  const createStoreWithMiddleware = applyMiddleware(walkMiddleware, ...middlewares)(createStore)

  return createStoreWithMiddleware(rootReducer, {})
}
```

### Ignoring the `through` condition

In case that you just want to use a walk to chain execution of actions, you can ignore the `through` property of the walk. The middleware will then dispatch the target action with the original payload.

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

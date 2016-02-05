# redux-walk

An async extension for Redux that keeps you functional

## Example

Take a look at the [`example/src`](https://github.com/xaviervia/redux-walk/tree/master/example/src) folder for a very basic example. To try it out:

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

The key concept is that of a Walk, which is essentially a function that receives a `done` callback which should be called when the asynchronous operation is completed, with the desired payload. In the example, the walk creator is:

```js
export const callBackInX = function (numberOfMilliseconds) {
  return function (done) {
    setTimeout(() => done(numberOfMilliseconds / 1000), numberOfMilliseconds)
  }
}
```

Let's say that you want to perform an asynchronous operation when the action `RANDOM_NUMBER_IN_RANDOM_TIME` is created. The Action object for the redux action is extended with a `walk` property that contains two references:

- `through`: the Walk function to be executed by the middleware
- `to`: the action creator to be run when the walk is complete, which the middleware will then dispatch

Our actions (notice the `walk` property in the first action):

```js
import { callBackInX } from '../walks/random'

export const randomNumberInRandomTime = function () {
  const numberOfMilliseconds = Math.floor(Math.random() * 5000)
  return {
    type: 'RANDOM_NUMBER_IN_RANDOM_TIME',
    payload: numberOfMilliseconds,
    walk: {
      through: callBackInX(numberOfMilliseconds),
      to: randomNumberInRandomTimeReceived
    }
  }
}

export const randomNumberInRandomTimeReceived = function (numberOfMilliseconds) {
  return {
    type: 'RANDOM_NUMBER_IN_RANDOM_TIME_RECEIVED',
    payload: numberOfMilliseconds
  }
}
```

That's it! Simple, huh? And as a result, the action creators (and the walks, unless you are doing something wrong) are just functions, which result can be tested with simplicity and consistency, just like regular synchronous functions would.

Don't forget to add the middleware to the store:

```js
import walk from 'redux-walk'

import { createStore, applyMiddleware } from 'redux'
import rootReducer from '../reducers'

export default function configureStore () {
  const createStoreWithMiddleware = applyMiddleware(walk, ...middlewares)(createStore)

  return createStoreWithMiddleware(rootReducer, {})
}
```

## Further justification

Besides the `walk` idiom, which can be safely ignored by the reducers, the Walk approach introduces no artifacts in your code:

- No weird `status` properties like in [`redux-promise`](https://www.npmjs.com/package/redux-promise)
- Actions are still actions, unlike in [`redux-thunk`](https://www.npmjs.com/package/redux-thunk)
- It's super flexible. Plug whatever you want as the walk function.

And the icing on the cake: you don't need to learn anything to use them! Walks are just pure functions, like reducers and action creators before them.

And it's only 15 lines of trivial code. Seriously. You could just copy paste it into your `configureStore` file instead.

## License

Copyright 2016 Fernando Via Canel

ISC license.

See [LICENSE](LICENSE) attached.

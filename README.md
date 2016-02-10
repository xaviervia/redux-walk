# redux-walk

An async extension for Redux that keeps you functional

## Install

```sh
npm install --save redux-walk
```

## Example

Take a look at the [`example/src`](https://github.com/xaviervia/redux-walk/tree/master/example/src) folder for an example. To try it out you can have it locally, or go to [xaviervia.github.io/redux-walk](http://xaviervia.github.io/redux-walk/)

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

- The **walkCreator**, which is a function that receives the action and returns a **Walk**.
- A **Walk**, which is either a reference to an action creator, or an object with two keys:
  - `resolve`, a reference to an action creator to be executed whenever the promise in the action is successful.
  - `reject`, a reference to an action creator to be executed whenever the promise in the action is rejected.

Let's say that you want to perform an asynchronous operation when firing `RANDOM_NUMBER_IN_RANDOM_TIME`. We need to add a promise to that action when we create it:


```js
export const randomNumberInRandomTime = function () {
  const numberOfMilliseconds = Math.floor(Math.random() * 5000)
  return {
    type: 'RANDOM_NUMBER_IN_RANDOM_TIME',
    payload: numberOfMilliseconds,
    meta: {
      promise: (resolve, reject) => setTimeout(() => resolve(numberOfMilliseconds), numberOfMilliseconds)
    }
  }
}

export const randomNumberInRandomTimeReceived = function (payload) {
  return {
    type: 'RANDOM_NUMBER_IN_RANDOM_TIME_RECEIVED',
    payload
  }
}
```

Then we need to specify a walk for the `RANDOM_NUMBER_IN_RANDOM_TIME` action. The walk should provide an action creator to be called when the promise is resolved. This is how the walk creator in the example looks like:

```js
import * as RandomActions from '../actions/random'

export default function walkCreator ({ type, payload }) {
  switch (type) {
    case 'RANDOM_NUMBER_IN_RANDOM_TIME':
      return {
        resolve: RandomActions.randomNumberInRandomTimeReceived,
        reject: () => { /* Would be called if the promise were to be rejected */ }
      }
  }
}
```

That's it! Simple, huh? As a result, both the action creators and the walk creators are just pure functions, which can be tested with simplicity and consistency, just like regular synchronous functions would.

Don't forget to add the middleware to the store:

```js
import createWalkMiddleware from 'redux-walk'

import { createStore, applyMiddleware } from 'redux'
import rootReducer from '../reducers'
import walkCreator from '../walks'

export default function configureStore () {
  const walkMiddleware = createWalkMiddleware(walkCreator)
  const createStoreWithMiddleware = applyMiddleware(walkMiddleware, ...middlewares)(createStore)

  return createStoreWithMiddleware(rootReducer, {})
}
```

### Chaining actions together

In case that you just want to chain the execution of two actions, you can skip setting a promise in the action. You will have to provide a walk that has only one target action creator instead of a resolve/reject pair. The middleware will then call the target action creator with the original payload and dispatch the resulting action.

Let's say that once the random number callback is received, we want to show a congratulations to the user, but only if the timeout happened in less than two seconds. We know that the payload is the number of milliseconds that took the setTimeout to be executed. We can write it like this:

```js
import * as RandomActions from '../actions/random'
import * as CongratulationsActions from '../actions/congratulations'

export default function walkCreator ({ type, payload }) {
  switch (type) {
    case 'RANDOM_NUMBER_IN_RANDOM_TIME':
      /* ... */
    case 'RANDOM_NUMBER_IN_RANDOM_TIME_RECEIVED':
      if (payload < 2000) {
        return CongratulationsActions.congratulationsShow
      }
  }
}
```

You might notice that redux-walk introduces two different but related features into the architecture. One is the idea of returning a promise as part of the action, which is also introduced in [`redux-promise`](https://www.npmjs.com/package/redux-promise). The real meat though comes with the concept of a walk, which is actually a way of chaining the execution of actions in a declarative, structured manner: if actions are the nodes of the application execution graph, walks describe the vertices between them.

To avoid embedding a lot of logic into them, the walk creators have access to very restricted information, namely  just the action being dispatched. They are supposed to be very atomic operations, in a way like a reducer: the bulk of the logic should still reside in the action creator, with the walk creator being kept a simple conditional structure that provides the link to the next action in the chain. If you have anything more than an `if` structure in the walk creator, you are adding to much complexity in that layer.

#### A single target action creator as a walk

You can specify a single action creator in the walk even when the action contains a promise. The middleware will then dispatch that action creator both if the promise is resolved or if it is rejected. In the example of the `RANDOM_NUMBER_IN_RANDOM_TIME`, this walk creator would also work:

```js
import * as RandomActions from '../actions/random'

export default function walkCreator ({ type, payload }) {
  switch (type) {
    case 'RANDOM_NUMBER_IN_RANDOM_TIME':
      return RandomActions.randomNumberInRandomTimeReceived
  }
}
```

### Using actual promise objects

Promise objects are supported by redux-walk. This will work as expected:

```js
export const randomHalfTimesItWorks = () => {
  return {
    type: 'RANDOM_HALF_TIMES_IT_WORKS',
    meta: {
      promise: new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.5) {
            resolve()
          } else {
            reject()
          }
        }, 1000)
      })
    }
  }
}
```

## Further justification

Besides the walks themselves and the `meta.promise` idiom in the action, which do not affect anything outside them in the architecture, the Walk approach introduces no artifacts in your code:

- No weird `status` properties like in [`redux-promise`](https://www.npmjs.com/package/redux-promise).
- Actions are still actions, unlike in [`redux-thunk`](https://www.npmjs.com/package/redux-thunk).
- It's super flexible. Plug whatever you want in the promise.

And the icing on the cake: you don't need to learn anything to use them! Walk creators are just pure functions, like reducers and action creators before them.

Another consideration when designing redux-walk was to keep the actions as actions, and treat the promises as metadata. In `redux-promise`, the promise is provided in the action as part of the payload, because the action is not considered done until the promise is completed; but in practice this leads to some weirdness when the action should be dispatched immediately with a payload to be used in a reducer–for example for optimistic update of the state–because then the payload as returned by the action creator will not be the one actually dispatched, since the `redux-promise` middleware will modify it.

The philosophy behind `redux-walk` is that the type signature of the action creator should consistent with the actual action being passed around. This is important as a design good practice (we strive to be more functional, don't we?) but also to keep the cognitive load down: the whole point of the action creators being exposed in an ordered manner is to have canonical descriptions of the possible events that the application is capable or reacting to.

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

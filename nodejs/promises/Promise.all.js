#!/usr/bin/node

// Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
//
// `Promise.all` can catch the errors by any of the given promises.

const chain1 = async () => {
  console.log('chain1');
};

const f1 = async () => {
  console.log('f1');
};

const f2 = async () => {
  console.log('f2');

  // This error is not caught in chain 1, so it will be caught by Promise.all's
  // `catch` block.
  throw new Error('f2 error!');
};

const chain2 = async () => {
  console.log('chain2');
}

const f3 = async () => {
  console.log('f3');

  // This error is caught in chain 2, so it will be handled in chain 2 and will
  // not be thrown to Promise.all.
  throw new Error('delayed f3 error!');
};

Promise.all([
  chain1()
    .then(() => f1())
    .then(() => f2()),
    // Although it looks like `chain1` may allow errors to escape because it
    // doesn't provide a `catch` block, `Promise.all`'s `catch` block actually
    // can catch it.

  chain2()
    .then(() => f3())
    .catch(error => {
      console.error("chain2 error: ", error)
    }),
])
  .catch(error => {
    console.error('Promise.all caught error:', error);
  });

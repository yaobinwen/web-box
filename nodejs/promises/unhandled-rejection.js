#!/usr/bin/node

/**
 * The `catch` of a promise chain only catches the errors that are thrown in
 * that chain. If a separate promise chain is started inside the outer chain,
 * the thrown errors will not be caught by the outer chain and may result in
 * the "unhandled rejection" error.
 */

async function c1_f1() {
  console.log('chain 1: f1');
}

async function c1_f2() {
  console.log('chain 1: f2');
  throw new Error('error on chain 1 f2');
}

async function c1_f3() {
  console.log('chain 1: f3');
}

console.log("=".repeat(20))
console.log("Demo 1: Catching error thrown in the same promise chain")
await c1_f1()
  .then(() => c1_f2())
  .then(() => c1_f3())
  .catch(error => {
    console.error('Aww! What happened?!', error);
  });

async function c2_f2() {
  console.log('chain 2: f2')
  throw new Error('error on chain 2 f2')
}

console.log("=".repeat(20))
console.log("Demo 2a: Link `c2_f2()` to the outer promise chain by returning its result")
await c1_f1()
  .then(() => {
    // By returning the result of `c2_f2()`, we link `c2_f2()` to the outer
    // promise chain, so the error thrown out of `c2_f2()` can be caught by
    // the `catch` block.
    return c2_f2()
  })
  .then(() => c1_f3())
  .catch(error => {
    console.error('Aww! What happened?!', error);
  });

console.log("=".repeat(20))
console.log("Demo 2b: Build a `catch` for the separate promise chain")
await c1_f1()
  .then(() => {
    // By returning the result of `c2_f2()`, we link `c2_f2()` to the outer
    // promise chain, so the error thrown out of `c2_f2()` can be caught by
    // the `catch` block.
    c2_f2()
    .catch(error => {
      // The error is caught and handled here so the outer promise chain would
      // not be interrupted and can still move onto `c1_f3()`.
      console.error('Caught an error: ', error)
    })
  })
  .then(() => c1_f3())
  .catch(error => {
    console.error('Aww! What happened?!', error);
  });

console.log("=".repeat(20))
console.log("Demo 3: Errors thrown in a separate promise chain can't be caught")
await c1_f1()
  .then(() => {
    // Because the return value of `c2_f2()` was not returned to the outer
    // promise chain, `c2_f2()` itself became a separate promise chain than
    // the outer one, so the error that's thrown by `c2_f2()` can't be caught
    // by the `catch` block for the outer promise chain.
    c2_f2()
  })
  .then(() => c1_f3())
  .catch(error => {
    console.error('Aww! What happened?!', error);
  });

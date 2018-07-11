import React from 'react';
import License from '../License';
import enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import fetchMock from 'fetch-mock/es5/server';

enzyme.configure({ adapter: new Adapter() });

// NOTE(ywen): We reuse the 'fetchMock' in 'License.js'. In real test code, you
// need to define your own fetch mocks.

describe('Functionality Testing', () => {
  test('Test a single async call', (done) => {
    expect.assertions(1)

    // NOTE(ywen): To use promise for testing, the fetching method
    // (`fetchLicense` in this case) must return the promise. If the product
    // code doesn't return the promise, you may need to use the other testing
    // methods as shown in `About.test.js` to test it.
    let promise;
    let old = License.prototype.fetchLicense;
    License.prototype.fetchLicense = jest.fn(function() {
        promise = old.call(this);
    })

    let wrapper = mount(
      <License />, document.createElement('div')
    );

    return promise.then(() => {
      expect(wrapper.find('p').at(0).text()).toEqual('License: MIT');
      done();
    });
  })

  test('Test license fetching failure', (done) => {
    let oldGlobalFetch = global.fetch;

    fetchMock.mock(
      '/license',
      new Promise((resolve, reject) => {
        setTimeout(
          () => {reject(new Error('Backend communication error'))}, 1000
        );
      }),
      {overwriteRoutes: true}
    )

    expect.assertions(1)

    let expects = (done) => {
      try {
        expect(wrapper.find('p').at(0).text()).toEqual(
          'License: <Unable to fetch license: Backend communication error>'
        );
      } catch (error) {
        done.fail(error);
      }
      done();
    }

    let oldSetState = License.prototype.setState;
    License.prototype.setState = jest.fn(
      // NOTE(ywen): We must not use arrow function to define the mocked
      // implementation because the arrow function uses the `this` at the time
      // of definition rather than run-time. If we want the `oldSetState` to be
      // called with the context at the run-time, we need to use `function` to
      // define the mocked implementation.
      function(changes) {
        oldSetState.call(this, changes);
        expects(done);
      }
    );

    let wrapper = mount(<License />, document.createElement('div'));
  })
})
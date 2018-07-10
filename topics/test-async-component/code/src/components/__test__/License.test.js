import React from 'react';
import ReactDOM from 'react-dom';
import License from '../License';
import enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

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
})
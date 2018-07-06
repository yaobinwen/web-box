import React from 'react';
import ReactDOM from 'react-dom';
import License from '../License';
import enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

enzyme.configure({ adapter: new Adapter() });

// NOTE(ywen): We reuse the 'fetchMock' in 'License.js'. In real test code, you
// need to define your own fetch mocks.

describe('Smoke Testing', () => {
  test('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<License />, div);
    // ReactDOM.unmountComponentAtNode(div);
  });
})

describe('Functionality Testing', () => {
  test('Test a single async call', (done) => {
    expect.assertions(1)

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
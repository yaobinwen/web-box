import React from 'react';
import ReactDOM from 'react-dom';
import About from '../About';
import enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

enzyme.configure({ adapter: new Adapter() });

// NOTE(ywen): We reuse the 'fetchMock' in 'About.js'. In real test code, you
// need to define your own fetch mocks.

describe('Functionality Testing', () => {
  test('Test a single async call', (done) => {
    // Make sure the expects are called.
    expect.assertions(1)

    let wrapper = mount(
      <About />, document.createElement('div')
    );

    // NOTE(ywen): Because the `updateAuthor` is called in the resolver of the
    // fetch promise, it is thus called after this test function returns. We
    // can replace the method with the mocked one after mounting and it will
    // still be called.
    let appInst = wrapper.instance();
    let old = appInst.updateAuthor;
    appInst.updateAuthor = jest.fn(
      (name) => {
        // Call the old method first.
        old.call(appInst, name)
        // Call expect statement to test the expectation.
        // TODO(ywen): I use a timer to make sure the expect and done are
        // scheduled to be called after state update is actually done. But I
        // need to double check if this is true.
        setTimeout(() => {
          expect(wrapper.find('p').at(0).text()).toEqual('Author: Yaobin Wen')
          done()
        })
      }
    );
  })

  test('Test both async calls (using mocked instance method)', (done) => {
    expect.assertions(2)

    let wrapper = mount(
      <About />, document.createElement('div')
    );

    let expects = () => {
      expect(wrapper.find('p').at(0).text()).toEqual('Author: Yaobin Wen')
      expect(wrapper.find('p').at(1).text()).toEqual('Description: Test async component')
    }

    let doneCounter = 0
    let updateDone = () => {
      // Only call the expects and done when both updates are done.
      if (++doneCounter === 2) {
        expects()
        done()
      }
    }

    let appInst = wrapper.instance();
    let oldUpdateAuthor = appInst.updateAuthor;
    let oldUpdateDescription = appInst.updateDescription;
    appInst.updateAuthor = jest.fn(
      (name) => {
        oldUpdateAuthor.call(appInst, name);
        updateDone();
      }
    );
    appInst.updateDescription = jest.fn(
      (description) => {
        oldUpdateDescription.call(appInst, description);
        updateDone();
      }
    );
  })

  test('Test both async calls (using mocked class method)', (done) => {
    expect.assertions(2);

    let expects = () => {
      // NOTE(ywen): The code uses 'wrapper' that is defined later in this test
      // function. This is valid in JavaScript.
      expect(wrapper.find('p').at(0).text()).toEqual('Author: Yaobin Wen')
      expect(wrapper.find('p').at(1).text()).toEqual('Description: Test async component')
    }

    // Replace the class method with the mocked version.
    let callCounter = 0;
    let oldSetState = About.prototype.setState;
    About.prototype.setState = jest.fn(
      // NOTE(ywen): We must not use arrow function to define the mocked
      // implementation because the arrow function uses the `this` at the time
      // of definition rather than run-time. If we want the `oldSetState` to be
      // called with the context at the run-time, we need to use `function` to
      // define the mocked implementation.
      function(changes) {
        oldSetState.call(this, changes);
        if (++callCounter === 2) {
          expects(this);
          done();
        }
      }
    );

    // Create the tested component.
    let wrapper = mount(<About />, document.createElement('div'));
  })
})
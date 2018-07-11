import React from 'react';
import About from '../About';
import enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import fetchMock from 'fetch-mock/es5/server';

enzyme.configure({ adapter: new Adapter() });

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

  test('Fetching author fails', (done) => {
    let oldGlobalFetch = global.fetch;

    // To test the failure case, we need to return promises that are eventually
    // rejected. Therefore, we need to override the current (mocked) fetch and
    // change it back at the end of the test.
    fetchMock.mock(
      '/info/author',
      new Promise((resolve, reject) => {
        setTimeout(
          () => {reject(new Error('Backend communication error'))}, 1000
        );
      }),
      {overwriteRoutes: true}
    ).mock(
      '/info/description',
      new Promise((resolve, reject) => {
        setTimeout(
          () => {reject(new Error('Backend communication error'))}, 500
        );
      }),
      {overwriteRoutes: true}
    );

    expect.assertions(2);

    let expects = () => {
      // NOTE(ywen): The code uses 'wrapper' that is defined later in this test
      // function. This is valid in JavaScript.
      expect(wrapper.find('p').at(0).text()).toEqual(
        'Author: <Unable to fetch author name: Backend communication error>'
      );
      expect(wrapper.find('p').at(1).text()).toEqual(
        'Description: <Unable to fetch project description: Backend communication error>'
      );
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
          // Run the expects.
          expects(this);
          // Change back to the original fetch.
          global.fetch = oldGlobalFetch;
          // Set the test done.
          done();
        }
      }
    );

    // Create the tested component.
    let wrapper = mount(<About />, document.createElement('div'));
  })
})
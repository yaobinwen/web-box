import React from 'react';
import ReactDOM from 'react-dom';
import About from '../About';
import enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

enzyme.configure({ adapter: new Adapter() });

// NOTE(ywen): We reuse the 'fetchMock' in 'App.js'. In real test code, you
// need to define your own fetch mocks.

describe('Smoke Testing', () => {
  test('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<About />, div);
    // ReactDOM.unmountComponentAtNode(div);
  });
})

describe('Functionality Testing', () => {
  test('Test a single async call', (done) => {
    expect.assertions(1)

    let wrapper = mount(
      <About />, document.createElement('div')
    );

    // NOTE(ywen): Assumptions:
    // 1). The 'setState' is not called before this function returns.
    let appInst = wrapper.instance();
    let old = appInst.updateAuthor;
    appInst.updateAuthor = jest.fn(
      (name) => {
        old.call(appInst, name)
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

    // NOTE(ywen): Assumptions:
    // 1). The 'setState' is not called before this function returns.
    let doneCounter = 0
    let updateDone = () => {
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
    About.prototype.setState = jest.fn(function(changes) {
      oldSetState.call(this, changes);
      if (++callCounter === 2) {
        expects(this);
        done();
      }
    });

    // Create the tested component.
    let wrapper = mount(<About />, document.createElement('div'));
  })
})
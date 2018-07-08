import React from 'react';
import renderer from 'react-test-renderer';
import AboutView from '../AboutView';

test('renders without crashing', () => {
  expect.assertions(1);

  let tree = renderer.create(
    <AboutView
      author='Test Author'
      description='Test Description'
    />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
import React from 'react';
import renderer from 'react-test-renderer';
import LicenseView from '../LicenseView';

test('renders without crashing', () => {
  expect.assertions(1);

  let tree = renderer.create(
    <LicenseView license='Test License' />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
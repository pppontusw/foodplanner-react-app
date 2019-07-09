import React from 'react';
import { shallow } from 'enzyme';
import { findByDataTestAttr } from './../../../Utils';
import Loader from './Loader';

const setUp = (props = {}) => {
  const component = shallow(<Loader {...props} />);
  return component;
};

describe('Alerts (Errors)', () => {
  let component;
  beforeEach(() => {
    component = setUp();
  });

  it('renders without errors', () => {
    const loader = findByDataTestAttr(component, 'loaderDiv');
    expect(loader.length).toBe(1);
  });

  it('contains a spinner', () => {
    const spinner = findByDataTestAttr(component, 'spinner');
    expect(spinner.length).toBe(1);
  });
});

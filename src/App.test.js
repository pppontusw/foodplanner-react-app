import React from 'react';
import { shallow } from 'enzyme';
import { findByDataTestAttr } from './../Utils';
import App from './App';

const setUp = (props = {}) => {
  const component = shallow(<App {...props} />);
  return component;
};

describe('Day Component (connected)', () => {
  let component;
  beforeEach(() => {
    component = setUp();
  });

  it('renders without crashing', () => {
    const appDiv = findByDataTestAttr(component, 'appDiv');
    expect(appDiv.length).toBe(1);
  });

  it('renders a route for Index', () => {
    const routeIndex = findByDataTestAttr(component, 'routeIndex');
    expect(routeIndex.length).toBe(1);
  });

  it('renders a route for Login', () => {
    const routeLogin = findByDataTestAttr(component, 'routeLogin');
    expect(routeLogin.length).toBe(1);
  });

  it('renders a route for Register', () => {
    const routeRegister = findByDataTestAttr(component, 'routeRegister');
    expect(routeRegister.length).toBe(1);
  });

  it('renders a route for List', () => {
    const routeList = findByDataTestAttr(component, 'routeList');
    expect(routeList.length).toBe(1);
  });

  it('renders a route for Profile', () => {
    const routeProfile = findByDataTestAttr(component, 'routeProfile');
    expect(routeProfile.length).toBe(1);
  });

  it('renders a route for ListSettings', () => {
    const routeListSettings = findByDataTestAttr(
      component,
      'routeListSettings'
    );
    expect(routeListSettings.length).toBe(1);
  });
  it('renders a nav Component', () => {
    const navComponent = findByDataTestAttr(component, 'navComponent');
    expect(navComponent.length).toBe(1);
  });
  it('renders an alerts Component', () => {
    const alertsComponent = findByDataTestAttr(component, 'alertsComponent');
    expect(alertsComponent.length).toBe(1);
  });
});

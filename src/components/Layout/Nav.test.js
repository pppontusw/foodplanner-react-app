import React from 'react';
import { shallow } from 'enzyme';
import { findByDataTestAttr, testStore } from './../../../Utils';
import Nav from './Nav';

const setUp = (props = {}, initialState = {}) => {
  const store = testStore(initialState);
  const component = shallow(<Nav store={store} {...props} />)
    .childAt(0)
    .dive();
  return component;
};

describe('Nav Component (Unauthenticated)', () => {
  let component;
  beforeEach(() => {
    component = setUp();
  });

  it('renders without errors', () => {
    const navBar = findByDataTestAttr(component, 'navBar');
    expect(navBar.length).toBe(1);
  });

  it('Should render login link', () => {
    const login = findByDataTestAttr(component, 'login');
    expect(login.length).toBe(1);
  });
});

describe('Nav Component (Logged in)', () => {
  let component;
  beforeEach(() => {
    const state = {
      auth: {
        isAuthenticated: true
      }
    };
    component = setUp({}, state);
  });

  it('renders without errors', () => {
    const navBar = findByDataTestAttr(component, 'navBar');
    expect(navBar.length).toBe(1);
  });

  it('Should render logout link', () => {
    const logout = findByDataTestAttr(component, 'logout');
    expect(logout.length).toBe(1);
  });

  it('Should render profile link', () => {
    const profile = findByDataTestAttr(component, 'profile');
    expect(profile.length).toBe(1);
  });
});

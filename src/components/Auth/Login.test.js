import React from 'react';
import { Redirect } from 'react-router-dom';
import { shallow } from 'enzyme';
import { findByDataTestAttr, testStore } from './../../../Utils';
import Login from './Login';

const setUp = (props = {}, initialState = {}) => {
  const store = testStore(initialState);
  const component = shallow(<Login store={store} {...props} />)
    .childAt(0)
    .dive();
  return component;
};

describe('Login Form (Unauthenticated)', () => {
  let component;
  beforeEach(() => {
    component = setUp();
  });

  it('renders without errors', () => {
    const loginForm = findByDataTestAttr(component, 'loginForm');
    expect(loginForm.length).toBe(1);
  });

  it('Should render username field', () => {
    const username = findByDataTestAttr(component, 'username');
    expect(username.length).toBe(1);
  });

  it('Should render password field', () => {
    const password = findByDataTestAttr(component, 'password');
    expect(password.length).toBe(1);
  });

  it('Should render login button', () => {
    const loginButton = findByDataTestAttr(component, 'loginButton');
    expect(loginButton.length).toBe(1);
  });

  it('Should render forgotPassword link', () => {
    const forgotPassword = findByDataTestAttr(component, 'forgotPassword');
    expect(forgotPassword.length).toBe(1);
  });

  it('Should render register link', () => {
    const register = findByDataTestAttr(component, 'register');
    expect(register.length).toBe(1);
  });
});

describe('Login Form (Logged in)', () => {
  let component;
  beforeEach(() => {
    const state = {
      auth: {
        isAuthenticated: true
      }
    };
    component = setUp({}, state);
  });

  it('renders a redirect', () => {
    expect(component.find(Redirect).length).toBe(1);
  });
});

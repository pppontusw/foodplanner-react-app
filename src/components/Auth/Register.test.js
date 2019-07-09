import React from 'react';
import { Redirect } from 'react-router-dom';
import { shallow } from 'enzyme';
import { findByDataTestAttr, testStore } from './../../../Utils';
import Register from './Register';

const setUp = (props = {}, initialState = {}) => {
  const store = testStore(initialState);
  const component = shallow(<Register store={store} {...props} />)
    .childAt(0)
    .dive();
  return component;
};

describe('Register Form', () => {
  let component;
  beforeEach(() => {
    component = setUp();
  });

  it('renders without errors', () => {
    const registerForm = findByDataTestAttr(component, 'registerForm');
    expect(registerForm.length).toBe(1);
  });

  it('Should render username field', () => {
    const username = findByDataTestAttr(component, 'username');
    expect(username.length).toBe(1);
  });

  it('Should render firstname field', () => {
    const firstname = findByDataTestAttr(component, 'firstname');
    expect(firstname.length).toBe(1);
  });

  it('Should render lastname field', () => {
    const lastname = findByDataTestAttr(component, 'lastname');
    expect(lastname.length).toBe(1);
  });
  it('Should render email field', () => {
    const email = findByDataTestAttr(component, 'email');
    expect(email.length).toBe(1);
  });

  it('Should render password field', () => {
    const password = findByDataTestAttr(component, 'password');
    expect(password.length).toBe(1);
  });

  it('Should render password2 field', () => {
    const password2 = findByDataTestAttr(component, 'password2');
    expect(password2.length).toBe(1);
  });

  it('Should render registerSubmitButton button', () => {
    const registerSubmitButton = findByDataTestAttr(
      component,
      'registerSubmitButton'
    );
    expect(registerSubmitButton.length).toBe(1);
  });
});

describe('Register Form (Logged in)', () => {
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

import React from 'react';
import { shallow } from 'enzyme';
import { findByDataTestAttr, testStore } from './../../../Utils';
import Profile from './Profile';

const setUp = (props = {}, initialState = {}) => {
  const store = testStore(initialState);
  const component = shallow(<Profile store={store} {...props} />, {
    disableLifecycleMethods: false
  })
    .childAt(0)
    .dive();
  return component;
};

describe('Profile Form', () => {
  let component;
  beforeEach(() => {
    component = setUp(
      {},
      {
        auth: {
          user: {
            username: 'TestUser',
            email: 'test_user@test.com',
            firstname: 'Test',
            lastname: 'User'
          }
        }
      }
    );
  });

  it('renders without errors', () => {
    const profileForm = findByDataTestAttr(component, 'profileForm');
    expect(profileForm.length).toBe(1);
  });

  it('Should render username field with state', () => {
    const username = findByDataTestAttr(component, 'username');
    expect(username.length).toBe(1);
    expect(username.props().value).toBe('TestUser');
  });

  it('Should render firstname field with state', () => {
    const firstname = findByDataTestAttr(component, 'firstname');
    expect(firstname.length).toBe(1);
    expect(firstname.props().value).toBe('Test');
  });

  it('Should render lastname field with state', () => {
    const lastname = findByDataTestAttr(component, 'lastname');
    expect(lastname.length).toBe(1);
    expect(lastname.props().value).toBe('User');
  });
  it('Should render email field with state', () => {
    const email = findByDataTestAttr(component, 'email');
    expect(email.length).toBe(1);
    expect(email.props().value).toBe('test_user@test.com');
  });

  it('Should render password field', () => {
    const password = findByDataTestAttr(component, 'password');
    expect(password.length).toBe(1);
  });

  it('Should render password2 field', () => {
    const password2 = findByDataTestAttr(component, 'password2');
    expect(password2.length).toBe(1);
  });

  it('Should render profileSubmitButton button', () => {
    const profileSubmitButton = findByDataTestAttr(
      component,
      'profileSubmitButton'
    );
    expect(profileSubmitButton.length).toBe(1);
  });
});

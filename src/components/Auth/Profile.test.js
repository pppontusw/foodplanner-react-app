import React from 'react';
import { shallow } from 'enzyme';
import { findByDataTestAttr, testStore } from './../../../Utils';
import ProfileConnected, { Profile } from './Profile';

const setUp = (props = {}, initialState = {}) => {
  const store = testStore(initialState);
  const component = shallow(<ProfileConnected store={store} {...props} />, {
    disableLifecycleMethods: false
  })
    .childAt(0)
    .dive();
  return component;
};

describe('Profile Form (connected)', () => {
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

const setUpWithoutStore = (props = {}) => {
  const component = shallow(<Profile {...props} />);
  return component;
};

describe('Profile Form (without store)', () => {
  let component;
  const mockUpdateUser = jest.fn();
  const mockCreateMessage = jest.fn();
  beforeEach(() => {
    component = setUpWithoutStore({
      updateUser: mockUpdateUser,
      createMessage: mockCreateMessage,
      user: {
        username: 'oldUsername',
        firstname: 'oldFirstname',
        lastname: 'oldLastname',
        email: 'oldEmail',
        id: 1
      }
    });
  });

  it('changes state correctly when onChange is called', () => {
    const instance = component.instance();

    instance.onChange({
      target: {
        name: 'username',
        value: 'something'
      }
    });

    expect(instance.state.username).toBe('something');
  });

  it('copies to local state when component is mounted', async () => {
    const instance = component.instance();
    await instance.componentDidMount();

    expect(instance.state.username).toBe('oldUsername');
    expect(instance.state.email).toBe('oldEmail');
    expect(instance.state.firstname).toBe('oldFirstname');
    expect(instance.state.lastname).toBe('oldLastname');
  });

  it('onSubmit will call updateUser', () => {
    const instance = component.instance();

    instance.state.username = 'username';
    instance.state.email = 'email';
    instance.state.password = 'password';
    instance.state.password2 = 'password';
    instance.state.firstname = 'firstname';
    instance.state.lastname = 'lastname';

    instance.onSubmit({
      preventDefault: jest.fn()
    });

    expect(mockUpdateUser).toBeCalled();
    expect(mockUpdateUser).toBeCalledWith(1, {
      username: 'username',
      firstname: 'firstname',
      lastname: 'lastname',
      email: 'email',
      password: 'password'
    });
  });

  it('onSubmit will fail and create a message if passwords do not match', () => {
    const instance = component.instance();

    instance.state.username = 'username';
    instance.state.email = 'email';
    instance.state.password = 'password';
    instance.state.password2 = 'password2';
    instance.state.firstname = 'firstname';
    instance.state.lastname = 'lastname';

    instance.onSubmit({
      preventDefault: jest.fn()
    });

    expect(mockCreateMessage).toBeCalled();
    expect(mockCreateMessage).toBeCalledWith({
      passwordNotMatch: 'Passwords do not match'
    });
  });
});

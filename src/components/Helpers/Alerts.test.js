import React from 'react';
import { shallow } from 'enzyme';
import { testStore } from './../../../Utils';
import AlertsConnected, { Alerts } from './Alerts';
import * as antd from 'antd';

const setUp = (props = {}, initialState = {}) => {
  const store = testStore(initialState);
  const component = shallow(<AlertsConnected store={store} {...props} />)
    .childAt(0)
    .dive();
  return component;
};

describe('Alerts (connected)', () => {
  let component;
  beforeEach(() => {
    component = setUp(
      {},
      {
        errors: {
          msg: {
            message: 'TestError'
          },
          status: 400
        },
        messages: {
          passwordNotMatch: 'nomatch'
        }
      }
    );
  });

  it('test mapStateToProps', () => {
    expect(component.instance().props.error.msg.message).toBe('TestError');
    expect(component.instance().props.message.passwordNotMatch).toBe('nomatch');
  });
});

const setUpWithoutStore = (props = {}) => {
  const component = shallow(<Alerts {...props} />);
  return component;
};

const propsError = {
  error: {
    msg: {
      message: 'TestError'
    },
    status: 400
  },
  message: {}
};

const propsMessage = {
  error: {},
  message: {
    passwordNotMatch: 'TestMessage'
  }
};

const propsMessageUserSuccess = {
  error: {},
  message: {
    updateUserSuccess: 'UserSuccess'
  }
};

const prevProps = {
  error: {},
  message: {}
};

describe('Alerts component (without store)', () => {
  let component;
  beforeEach(() => {});

  it('calls openNotificationWithIcon correctly for an error', async () => {
    const mockOpenNotificationWithIcon = jest.fn();
    component = setUpWithoutStore(propsError);
    const instance = component.instance();
    instance.openNotificationWithIcon = mockOpenNotificationWithIcon;
    await instance.componentDidUpdate(prevProps);

    expect(mockOpenNotificationWithIcon).toBeCalled();
    expect(mockOpenNotificationWithIcon).toBeCalledWith(
      'error',
      400,
      'TestError'
    );
  });

  it('calls openNotificationWithIcon correctly for a message', async () => {
    const mockOpenNotificationWithIcon = jest.fn();
    component = setUpWithoutStore(propsMessage);
    const instance = component.instance();
    instance.openNotificationWithIcon = mockOpenNotificationWithIcon;
    await instance.componentDidUpdate(prevProps);

    expect(mockOpenNotificationWithIcon).toBeCalled();
    expect(mockOpenNotificationWithIcon).toBeCalledWith(
      'error',
      'TestMessage',
      'TestMessage'
    );
  });

  it('calls openNotificationWithIcon correctly for UserSuccess', async () => {
    const mockOpenNotificationWithIcon = jest.fn();
    component = setUpWithoutStore(propsMessageUserSuccess);
    const instance = component.instance();
    instance.openNotificationWithIcon = mockOpenNotificationWithIcon;
    await instance.componentDidUpdate(prevProps);

    expect(mockOpenNotificationWithIcon).toBeCalled();
    expect(mockOpenNotificationWithIcon).toBeCalledWith(
      'success',
      'UserSuccess',
      'UserSuccess'
    );
  });

  it('openNotificationWithIcon correctly triggers antd notification', () => {
    component = setUpWithoutStore(propsMessage);

    const mockError = jest.fn();
    antd.notification.error = mockError;

    const mockSuccess = jest.fn();
    antd.notification.success = mockSuccess;

    const instance = component.instance();

    instance.openNotificationWithIcon('error', 400, 'TestError');
    expect(mockError).toBeCalled();
    expect(mockError).toBeCalledWith({
      message: 'Request Error',
      description: 'TestError'
    });

    instance.openNotificationWithIcon('error', 401, 'TestError');
    expect(mockError).toBeCalledWith({
      message: 'Login Failed',
      description: 'TestError'
    });

    instance.openNotificationWithIcon('error', 403, 'TestError');
    expect(mockError).toBeCalledWith({
      message: 'Permission Denied',
      description: 'TestError'
    });

    instance.openNotificationWithIcon('error', 404, 'TestError');
    expect(mockError).toBeCalledWith({
      message: 'Not Found',
      description: 'TestError'
    });

    instance.openNotificationWithIcon('error', 500, 'TestError');
    expect(mockError).toBeCalledWith({
      message: 'Server Error',
      description: 'TestError'
    });

    instance.openNotificationWithIcon('success', 'Message', 'TestMessage');
    expect(mockSuccess).toBeCalled();
    expect(mockSuccess).toBeCalledWith({
      message: 'Message',
      description: 'TestMessage'
    });
  });
});

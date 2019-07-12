import { mockStore } from './../../Utils';
import moxios from 'moxios';
import * as types from './types';
import { login, register, updateUser, logout, loadUser } from './auth';

describe('Shares action creators', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('can login', () => {
    const userObj = {
      username: 'user1',
      email: 'user1',
      firstname: 'user1',
      lastname: 'user1',
      password: 'user1'
    };

    const expectedActions = [{ type: types.LOGIN_SUCCESS, payload: userObj }];

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: userObj
      });
    });

    const store = mockStore({ shares: {} });

    return store
      .dispatch(login(userObj.username, userObj.password))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('can load user', () => {
    const userObj = {
      username: 'user1',
      email: 'user1',
      firstname: 'user1',
      lastname: 'user1',
      password: 'user1'
    };

    const expectedActions = [
      { type: types.USER_LOADING },
      { type: types.USER_LOADED, payload: userObj }
    ];

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: userObj
      });
    });

    const store = mockStore({ shares: {} });

    return store.dispatch(loadUser()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('clears data if load user fails', () => {
    const errorObj = {
      msg: 'ERROR'
    };

    const expectedActions = [
      { type: types.USER_LOADING },
      { type: types.GET_ERRORS, payload: { msg: errorObj, status: 400 } },
      { type: types.AUTH_ERROR },
      { type: types.CLEAR_LISTS },
      { type: types.CLEAR_DAYS },
      { type: types.CLEAR_ENTRIES }
    ];

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 400,
        response: errorObj
      });
    });

    const store = mockStore({ shares: {} });

    return store.dispatch(loadUser()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('can register', () => {
    const userObj = {
      username: 'user1',
      email: 'user1',
      firstname: 'user1',
      lastname: 'user1',
      password: 'user1'
    };

    const expectedActions = [
      { type: types.REGISTER_SUCCESS, payload: userObj }
    ];

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: userObj
      });
    });

    const store = mockStore({ shares: {} });

    return store.dispatch(register(userObj)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('can logout', () => {
    const expectedActions = [
      { type: types.LOGOUT_SUCCESS },
      { type: types.CLEAR_LISTS },
      { type: types.CLEAR_DAYS },
      { type: types.CLEAR_ENTRIES }
    ];

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: { msg: 'successfully logged out' }
      });
    });

    const store = mockStore({ shares: {} });

    return store.dispatch(logout()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('can update user', () => {
    const userObj = {
      username: 'user1',
      email: 'user1',
      firstname: 'user1',
      lastname: 'user1',
      password: 'user1'
    };

    const expectedActions = [
      {
        type: types.UPDATE_USER_SUCCESS,
        payload: { ...userObj, msg: 'SUCCESS' }
      },
      {
        type: types.CREATE_MESSAGE,
        payload: { updateUserSuccess: 'SUCCESS' }
      }
    ];

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: { ...userObj, msg: 'SUCCESS' }
      });
    });

    const store = mockStore({ shares: {} });

    return store.dispatch(updateUser(1, userObj)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

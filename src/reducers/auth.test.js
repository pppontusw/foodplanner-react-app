import auth from './auth';
import * as types from '../actions/types';

const initialState = {
  isAuthenticated: null,
  isLoading: false,
  user: null
};

const aUser = {
  username: 'user1'
};

const authState = {
  ...initialState,
  user: aUser,
  isAuthenticated: true
};

describe('shares reducer', () => {
  it('should return the initial state', () => {
    expect(auth(undefined, {})).toEqual(initialState);
  });

  it('will load user', () => {
    expect(auth(initialState, { type: types.USER_LOADING })).toEqual({
      ...initialState,
      isLoading: true
    });
  });

  it('can login', () => {
    expect(
      auth(initialState, { type: types.LOGIN_SUCCESS, payload: aUser })
    ).toEqual(authState);
  });

  it('resets state on failure', () => {
    expect(auth(authState, { type: types.AUTH_ERROR })).toEqual({
      ...initialState,
      isAuthenticated: false
    });
  });
});

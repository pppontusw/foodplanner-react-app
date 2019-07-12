import errors from './errors';
import * as types from '../actions/types';

const initialState = {
  msg: {},
  status: null
};

describe('errors reducer', () => {
  it('should return the initial state', () => {
    expect(errors(undefined, {})).toEqual(initialState);
  });

  it('should create message', () => {
    expect(
      errors(initialState, {
        type: types.GET_ERRORS,
        payload: { msg: 'MESSAGE', status: 400 }
      })
    ).toEqual({ msg: 'MESSAGE', status: 400 });
  });
});

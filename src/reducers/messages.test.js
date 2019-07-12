import messages from './messages';
import * as types from '../actions/types';

describe('messages reducer', () => {
  it('should return the initial state', () => {
    expect(messages(undefined, {})).toEqual({});
  });

  it('should create message', () => {
    expect(
      messages({}, { type: types.CREATE_MESSAGE, payload: 'TEST' })
    ).toEqual('TEST');
  });
});

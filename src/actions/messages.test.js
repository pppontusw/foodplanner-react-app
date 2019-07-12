import { mockStore } from './../../Utils';
import { createMessage, returnErrors } from './messages';
import * as types from './types';

describe('createMessage action', () => {
  it('creates createMessage with message payload', () => {
    const expectedActions = [
      { type: types.CREATE_MESSAGE, payload: 'MESSAGE' }
    ];

    const store = mockStore({ messages: {} });

    store.dispatch(createMessage('MESSAGE'));
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe('returnErrors action', () => {
  it('creates createMessage with message payload', () => {
    const expectedActions = [
      { type: types.GET_ERRORS, payload: { msg: 'MESSAGE', status: 400 } }
    ];

    const store = mockStore({ messages: {} });

    store.dispatch(returnErrors('MESSAGE', 400));
    expect(store.getActions()).toEqual(expectedActions);
  });
});

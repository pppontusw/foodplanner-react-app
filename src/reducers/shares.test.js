import shares from './shares';
import * as types from '../actions/types';

const sharesPayloadOne = [{ name: 'Test', id: 1 }];

const sharesPayloadTwo = [
  { name: 'Test', id: 1 },
  {
    name: 'AlsoTest',
    id: 2
  }
];

const sharesStateOne = {
  byId: {
    1: {
      name: 'Test',
      id: 1
    }
  },
  loading: false,
  firstFullLoad: false
};

const sharesStateTwo = {
  ...sharesStateOne,
  byId: {
    ...sharesStateOne.byId,
    2: {
      name: 'AlsoTest',
      id: 2
    }
  }
};

const initialState = {
  byId: {},
  loading: true,
  firstFullLoad: true
};

describe('shares reducer', () => {
  it('should return the initial state', () => {
    expect(shares(undefined, {})).toEqual(initialState);
  });

  it('should be able to clear state', () => {
    expect(shares(sharesStateOne, { type: types.CLEAR_SHARES })).toEqual(
      initialState
    );
  });

  it('should start loading', () => {
    expect(shares(sharesStateOne, { type: types.GET_SHARES })).toEqual({
      ...sharesStateOne,
      loading: true
    });
  });

  it('should handle payloads correctly (get/new)', () => {
    expect(
      shares(sharesStateOne, {
        type: types.GET_SHARES_SUCCESS,
        payload: sharesPayloadTwo
      })
    ).toEqual(sharesStateTwo);
  });

  it('should handle payloads correctly (delete/put)', () => {
    expect(
      shares(sharesStateTwo, {
        type: types.DELETE_SHARE_SUCCESS,
        payload: sharesPayloadOne
      })
    ).toEqual(sharesStateOne);
  });
});

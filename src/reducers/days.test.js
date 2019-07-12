import days from './days';
import * as types from '../actions/types';

const dayPayloadTwo = [
  { name: 'Test', id: 1 },
  {
    name: 'AlsoTest',
    id: 2
  }
];

const dayStateOne = {
  byId: {
    1: {
      name: 'Test',
      id: 1
    }
  },
  loading: false,
  firstFullLoad: false
};

const dayStateTwo = {
  ...dayStateOne,
  byId: {
    ...dayStateOne.byId,
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

describe('days reducer', () => {
  it('should return the initial state', () => {
    expect(days(undefined, {})).toEqual(initialState);
  });

  it('should be able to clear state', () => {
    expect(days(dayStateOne, { type: types.CLEAR_DAYS })).toEqual(initialState);
  });

  it('should start loading', () => {
    expect(days(dayStateOne, { type: types.GET_DAYS })).toEqual({
      ...dayStateOne,
      loading: true
    });
  });

  it('should handle payloads correctly (get and get all)', () => {
    expect(
      days(dayStateOne, {
        type: types.GET_DAYS_SUCCESS,
        payload: dayPayloadTwo
      })
    ).toEqual(dayStateTwo);

    expect(
      days(dayStateOne, {
        type: types.GET_ALL_DAYS_SUCCESS,
        payload: dayPayloadTwo
      })
    ).toEqual(dayStateTwo);
  });
});

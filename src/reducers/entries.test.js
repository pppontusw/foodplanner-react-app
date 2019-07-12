import entries from './entries';
import * as types from '../actions/types';

const entryPayloadTwo = [
  { name: 'Test', id: 1 },
  {
    name: 'AlsoTest',
    id: 2
  }
];

const entryStateOne = {
  byId: {
    1: {
      name: 'Test',
      id: 1
    }
  },
  loading: false,
  firstFullLoad: false
};

const entryStateTwo = {
  ...entryStateOne,
  byId: {
    ...entryStateOne.byId,
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

describe('entries reducer', () => {
  it('should return the initial state', () => {
    expect(entries(undefined, {})).toEqual(initialState);
  });

  it('should be able to clear state', () => {
    expect(entries(entryStateOne, { type: types.CLEAR_ENTRIES })).toEqual(
      initialState
    );
  });

  it('should start loading', () => {
    expect(entries(entryStateOne, { type: types.GET_ENTRIES })).toEqual({
      ...entryStateOne,
      loading: true
    });
  });

  it('should update an entry', () => {
    expect(
      entries(entryStateOne, {
        type: types.UPDATE_ENTRY,
        payload: { id: 2, name: 'AlsoTest' }
      })
    ).toEqual(entryStateTwo);
  });

  it('should handle payloads correctly (get and get all)', () => {
    expect(
      entries(entryStateOne, {
        type: types.GET_ENTRIES_SUCCESS,
        payload: entryPayloadTwo
      })
    ).toEqual(entryStateTwo);

    expect(
      entries(entryStateOne, {
        type: types.GET_ALL_ENTRIES_SUCCESS,
        payload: entryPayloadTwo
      })
    ).toEqual(entryStateTwo);
  });
});

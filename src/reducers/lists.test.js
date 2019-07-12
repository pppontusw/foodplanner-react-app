import lists from './lists';
import * as types from '../actions/types';

const listsPayloadOne = [{ name: 'Test', id: 1 }];

const listsPayloadTwo = [
  { name: 'Test', id: 1 },
  {
    name: 'AlsoTest',
    id: 2
  }
];

const listsStateOne = {
  byId: {
    1: {
      name: 'Test',
      id: 1
    }
  },
  loading: false,
  firstFullLoad: false,
  updatingTitle: false
};

const listsStateTwo = {
  ...listsStateOne,
  byId: {
    ...listsStateOne.byId,
    2: {
      name: 'AlsoTest',
      id: 2
    }
  }
};

const initialState = {
  byId: {},
  loading: true,
  firstFullLoad: true,
  updatingTitle: false
};

describe('lists reducer', () => {
  it('should return the initial state', () => {
    expect(lists(undefined, {})).toEqual(initialState);
  });

  it('should be able to clear state', () => {
    expect(lists(listsStateOne, { type: types.CLEAR_LISTS })).toEqual(
      initialState
    );
  });

  it('should start loading', () => {
    expect(lists(listsStateOne, { type: types.GET_LISTS })).toEqual({
      ...listsStateOne,
      loading: true
    });
  });

  it('should start updating title', () => {
    expect(lists(listsStateOne, { type: types.UPDATE_LIST_TITLE })).toEqual({
      ...listsStateOne,
      updatingTitle: true
    });
  });

  it('should handle payload correctly (get)', () => {
    expect(
      lists(listsStateOne, {
        type: types.GET_LISTS_SUCCESS,
        payload: listsPayloadTwo
      })
    ).toEqual(listsStateTwo);
  });

  it('should handle payload correctly (new)', () => {
    expect(
      lists(listsStateOne, {
        type: types.NEW_LIST,
        payload: listsPayloadTwo[1]
      })
    ).toEqual(listsStateTwo);
  });
});

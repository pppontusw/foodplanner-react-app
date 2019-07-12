import categories from './categories';
import * as types from '../actions/types';

const categoriesPayloadOne = [{ name: 'Test', id: 1 }];

const categoriesPayloadTwo = [
  { name: 'Test', id: 1 },
  {
    name: 'AlsoTest',
    id: 2
  }
];

const categoriesStateOne = {
  byId: {
    1: {
      name: 'Test',
      id: 1
    }
  },
  loading: false,
  firstFullLoad: false
};

const categoriesStateTwo = {
  ...categoriesStateOne,
  byId: {
    ...categoriesStateOne.byId,
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

describe('categories reducer', () => {
  it('should return the initial state', () => {
    expect(categories(undefined, {})).toEqual(initialState);
  });

  it('should be able to clear state', () => {
    expect(
      categories(categoriesStateOne, { type: types.CLEAR_CATEGORIES })
    ).toEqual(initialState);
  });

  it('should start loading', () => {
    expect(
      categories(categoriesStateOne, { type: types.GET_CATEGORIES })
    ).toEqual({
      ...categoriesStateOne,
      loading: true
    });
  });

  it('should handle payloads correctly (get/new)', () => {
    expect(
      categories(categoriesStateOne, {
        type: types.GET_CATEGORIES_SUCCESS,
        payload: categoriesPayloadTwo
      })
    ).toEqual(categoriesStateTwo);
  });

  it('should handle payloads correctly (delete/put)', () => {
    expect(
      categories(categoriesStateTwo, {
        type: types.DELETE_CATEGORY_SUCCESS,
        payload: categoriesPayloadOne
      })
    ).toEqual(categoriesStateOne);
  });
});

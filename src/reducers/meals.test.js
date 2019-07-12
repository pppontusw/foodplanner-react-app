import meals from './meals';
import * as types from '../actions/types';

const mealsPayloadOne = [{ name: 'Test', id: 1 }];

const mealsPayloadTwo = [
  { name: 'Test', id: 1 },
  {
    name: 'AlsoTest',
    id: 2
  }
];

const mealsStateOne = {
  byId: {
    1: {
      name: 'Test',
      id: 1
    }
  },
  loading: false,
  firstFullLoad: false
};

const mealsStateTwo = {
  ...mealsStateOne,
  byId: {
    ...mealsStateOne.byId,
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

describe('meals reducer', () => {
  it('should return the initial state', () => {
    expect(meals(undefined, {})).toEqual(initialState);
  });

  it('should be able to clear state', () => {
    expect(meals(mealsStateOne, { type: types.CLEAR_MEALS })).toEqual(
      initialState
    );
  });

  it('should start loading', () => {
    expect(meals(mealsStateOne, { type: types.GET_MEALS })).toEqual({
      ...mealsStateOne,
      loading: true
    });
  });

  it('should handle payloads correctly (get/new)', () => {
    expect(
      meals(mealsStateOne, {
        type: types.GET_MEALS_SUCCESS,
        payload: mealsPayloadTwo
      })
    ).toEqual(mealsStateTwo);
  });

  it('should handle payloads correctly (delete/put)', () => {
    expect(
      meals(mealsStateTwo, {
        type: types.DELETE_MEAL_SUCCESS,
        payload: mealsPayloadOne
      })
    ).toEqual(mealsStateOne);
  });
});

import foods from './foods';
import * as types from '../actions/types';

const foodsPayloadOne = [{ name: 'Test', id: 1 }];

const foodsPayloadTwo = [
  { name: 'Test', id: 1 },
  {
    name: 'AlsoTest',
    id: 2
  }
];

const foodsStateOne = {
  byId: {
    1: {
      name: 'Test',
      id: 1
    }
  },
  loading: false,
  firstFullLoad: false,
  updatingFoods: false
};

const foodsStateTwo = {
  ...foodsStateOne,
  byId: {
    ...foodsStateOne.byId,
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
  updatingFoods: false
};

describe('foods reducer', () => {
  it('should return the initial state', () => {
    expect(foods(undefined, {})).toEqual(initialState);
  });

  it('should be able to clear state', () => {
    expect(foods(foodsStateOne, { type: types.CLEAR_FOODS })).toEqual(
      initialState
    );
  });

  it('should start loading', () => {
    expect(foods(foodsStateOne, { type: types.GET_FOODS })).toEqual({
      ...foodsStateOne,
      loading: true
    });
  });

  it('should start updating food', () => {
    expect(foods(foodsStateOne, { type: types.PUT_FOOD })).toEqual({
      ...foodsStateOne,
      updatingFoods: true
    });
  });

  it('should handle payloads correctly (get/new/put)', () => {
    expect(
      foods(foodsStateOne, {
        type: types.GET_FOODS_SUCCESS,
        payload: foodsPayloadTwo
      })
    ).toEqual(foodsStateTwo);
  });

  it('should handle payloads correctly (delete)', () => {
    expect(
      foods(foodsStateTwo, {
        type: types.DELETE_FOOD_SUCCESS,
        payload: foodsPayloadOne
      })
    ).toEqual(foodsStateOne);
  });
});

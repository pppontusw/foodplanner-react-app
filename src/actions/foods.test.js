import { mockStore } from './../../Utils';
import moxios from 'moxios';
import { getFoodsByList, newFood, putFood, deleteFood } from './foods';
import * as types from './types';

describe('Foods action creators', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('getFoodsByList will fetch foods', () => {
    const returnFoods = [
      {
        name: 'Food1',
        id: 1
      }
    ];

    const expectedActions = [
      { type: types.GET_FOODS },
      { type: types.GET_FOODS_SUCCESS, payload: returnFoods }
    ];

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: returnFoods
      });
    });

    const store = mockStore({ foods: {} });

    return store.dispatch(getFoodsByList(1)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('newFood will post new food, refresh food and list', () => {
    const returnFoods = [
      {
        name: 'Food1',
        id: 1
      },
      {
        name: 'Food2',
        id: 2
      }
    ];

    const expectedActions = [
      { type: types.NEW_FOOD },
      { type: types.NEW_FOOD_SUCCESS, payload: returnFoods },
      { type: types.GET_LIST }
    ];

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: returnFoods
      });
    });

    const store = mockStore({ foods: {} });

    return store.dispatch(newFood(1, 'Food2')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('putFood will put food, refresh foods and categories', () => {
    const returnFoods = [
      {
        name: 'Food1',
        id: 1
      },
      {
        name: 'Food2',
        id: 2
      }
    ];

    const expectedActions = [
      { type: types.PUT_FOOD },
      { type: types.PUT_FOOD_SUCCESS, payload: returnFoods },
      { type: types.GET_CATEGORIES }
    ];

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: returnFoods
      });
    });

    const store = mockStore({ foods: {} });

    return store.dispatch(putFood(1, returnFoods[0])).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('deleteFood will send delete, refresh foods and list', () => {
    const returnFoods = [
      {
        name: 'Food1',
        id: 1
      },
      {
        name: 'Food2',
        id: 2
      }
    ];

    const expectedActions = [
      { type: types.DELETE_FOOD },
      { type: types.DELETE_FOOD_SUCCESS, payload: returnFoods },
      { type: types.GET_LIST }
    ];

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: returnFoods
      });
    });

    const store = mockStore({ foods: {} });

    return store.dispatch(deleteFood(1, 3)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

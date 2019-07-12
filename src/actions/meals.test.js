import { mockStore } from './../../Utils';
import moxios from 'moxios';
import { getMealsByList, newMeal, putMeals, deleteMeal } from './meals';
import * as types from './types';

describe('Meals action creators', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('getMealsByList will fetch meals', () => {
    const returnMeals = [
      {
        name: 'Meal1',
        id: 1
      }
    ];

    const expectedActions = [
      { type: types.GET_MEALS },
      { type: types.GET_MEALS_SUCCESS, payload: returnMeals }
    ];

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: returnMeals
      });
    });

    const store = mockStore({ meals: {} });

    return store.dispatch(getMealsByList(1)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('newMeal will post new meal, refresh meal and list', () => {
    const returnMeals = [
      {
        name: 'Meal1',
        id: 1
      },
      {
        name: 'Meal2',
        id: 2
      }
    ];

    const expectedActions = [
      { type: types.NEW_MEAL },
      { type: types.NEW_MEAL_SUCCESS, payload: returnMeals },
      { type: types.GET_LIST }
    ];

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: returnMeals
      });
    });

    const store = mockStore({ meals: {} });

    return store.dispatch(newMeal(1, 'Meal2')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('putMeals will put meal, refresh meals and list', () => {
    const returnMeals = [
      {
        name: 'Meal1',
        id: 1
      },
      {
        name: 'Meal2',
        id: 2
      }
    ];

    const expectedActions = [
      { type: types.PUT_MEALS },
      { type: types.PUT_MEALS_SUCCESS, payload: returnMeals },
      { type: types.GET_LIST }
    ];

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: returnMeals
      });
    });

    const store = mockStore({ meals: {} });

    return store.dispatch(putMeals(1, returnMeals)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('deleteMeal will send delete, refresh meals and list', () => {
    const returnMeals = [
      {
        name: 'Meal1',
        id: 1
      },
      {
        name: 'Meal2',
        id: 2
      }
    ];

    const expectedActions = [
      { type: types.DELETE_MEAL },
      { type: types.DELETE_MEAL_SUCCESS, payload: returnMeals },
      { type: types.GET_LIST }
    ];

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: returnMeals
      });
    });

    const store = mockStore({ meals: {} });

    return store.dispatch(deleteMeal(1, 3)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

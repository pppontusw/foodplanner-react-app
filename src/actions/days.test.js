import { mockStore } from './../../Utils';
import moxios from 'moxios';
import { getDaysByList, getDays } from './days';
import * as types from './types';

describe('Days action creators', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('getDaysByList will fetch days', () => {
    const returnDays = [
      {
        name: 'Day1',
        id: 1
      }
    ];

    const expectedActions = [
      { type: types.GET_DAYS },
      { type: types.GET_DAYS_SUCCESS, payload: returnDays }
    ];

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: returnDays
      });
    });

    const store = mockStore({ days: {} });

    return store.dispatch(getDaysByList(1, 0, false, false)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('getDays will get all days', () => {
    const returnDays = [
      {
        name: 'Day1',
        id: 1
      },
      {
        name: 'Day2',
        id: 2
      }
    ];

    const expectedActions = [
      { type: types.GET_DAYS },
      { type: types.GET_ALL_DAYS_SUCCESS, payload: returnDays }
    ];

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: returnDays
      });
    });

    const store = mockStore({ days: {} });

    return store.dispatch(getDays()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

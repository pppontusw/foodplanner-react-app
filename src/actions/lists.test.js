import { mockStore } from './../../Utils';
import moxios from 'moxios';
import {
  getLists,
  getList,
  createList,
  renameList,
  putListSettings
} from './lists';
import * as types from './types';

describe('Lists action creators', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('getLists will clear and then fetch all lists', () => {
    const returnLists = [
      {
        name: 'List1',
        id: 1
      }
    ];

    const expectedActions = [
      { type: types.CLEAR_LISTS },
      { type: types.GET_LISTS },
      { type: types.GET_LISTS_SUCCESS, payload: returnLists }
    ];

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: returnLists
      });
    });

    const store = mockStore({ shares: {} });

    return store.dispatch(getLists()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('getList will fetch a list', () => {
    const returnLists = [
      {
        name: 'List1',
        id: 1
      }
    ];

    const expectedActions = [
      { type: types.GET_LIST },
      { type: types.GET_LIST_SUCCESS, payload: returnLists }
    ];

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: returnLists
      });
    });

    const store = mockStore({ shares: {} });

    return store.dispatch(getList(1)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('createList will create a list, and fetch days and entries', () => {
    const returnLists = [
      {
        name: 'List1',
        id: 1
      }
    ];

    const expectedActions = [
      { type: types.NEW_LIST, payload: returnLists },
      { type: types.GET_DAYS },
      { type: types.GET_ENTRIES }
    ];

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: returnLists
      });
    });

    const store = mockStore({ shares: {} });

    return store.dispatch(createList('Name')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('renameList will trigger updating list title and update the list', () => {
    const returnLists = [
      {
        name: 'List1',
        id: 1
      }
    ];

    const expectedActions = [
      { type: types.UPDATE_LIST_TITLE },
      { type: types.GET_LIST_SUCCESS, payload: returnLists }
    ];

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: returnLists
      });
    });

    const store = mockStore({ shares: {} });

    return store.dispatch(renameList(1, 'Name')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('put list settings will put new list settings', () => {
    const returnLists = [
      {
        name: 'List1',
        id: 1,
        settings: {
          days_to_display: 7,
          start_day_of_week: 'Today'
        }
      }
    ];

    const expectedActions = [
      { type: types.PUT_LIST_SETTINGS, payload: returnLists }
    ];

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: returnLists
      });
    });

    const store = mockStore({ shares: {} });

    return store.dispatch(putListSettings(1, 7, 'Today')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

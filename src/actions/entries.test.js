import { mockStore } from './../../Utils';
import moxios from 'moxios';
import {
  getEntriesByList,
  newEntry,
  deleteEntry,
  getEntries,
  updateEntry
} from './entries';
import * as types from './types';

describe('Entries action creators', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('getEntriesByList will fetch entries', () => {
    const returnEntries = [
      {
        name: 'Entry1',
        id: 1
      }
    ];

    const expectedActions = [
      { type: types.GET_ENTRIES },
      { type: types.GET_ENTRIES_SUCCESS, payload: returnEntries }
    ];

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: returnEntries
      });
    });

    const store = mockStore({ entries: {} });

    return store.dispatch(getEntriesByList(1, 0, false, false)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('getEntries will get all entries', () => {
    const returnEntries = [
      {
        name: 'Entry1',
        id: 1
      },
      {
        name: 'Entry2',
        id: 2
      }
    ];

    const expectedActions = [
      { type: types.GET_ENTRIES },
      { type: types.GET_ALL_ENTRIES_SUCCESS, payload: returnEntries }
    ];

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: returnEntries
      });
    });

    const store = mockStore({ entries: {} });

    return store.dispatch(getEntries()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('update entry will update an entry', () => {
    const returnEntries = [
      {
        name: 'New',
        id: 1
      },
      {
        name: 'Entry2',
        id: 2
      }
    ];

    const expectedActions = [
      { type: types.UPDATE_ENTRY, payload: returnEntries }
    ];

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: returnEntries
      });
    });

    const store = mockStore({ entries: {} });

    return store.dispatch(updateEntry(1, 'New')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

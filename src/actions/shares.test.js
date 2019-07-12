import { mockStore } from './../../Utils';
import moxios from 'moxios';
import { getSharesByList, newShare, deleteShare } from './shares';
import * as types from './types';

describe('Shares action creators', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('getSharesByList will fetch shares', () => {
    const returnShares = [
      {
        name: 'Share1',
        id: 1
      }
    ];

    const expectedActions = [
      { type: types.GET_SHARES },
      { type: types.GET_SHARES_SUCCESS, payload: returnShares }
    ];

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: returnShares
      });
    });

    const store = mockStore({ shares: {} });

    return store.dispatch(getSharesByList(1)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('newShare will post new share, refresh share and list', () => {
    const returnShares = [
      {
        name: 'Share1',
        id: 1
      },
      {
        name: 'Share2',
        id: 2
      }
    ];

    const expectedActions = [
      { type: types.NEW_SHARE },
      { type: types.NEW_SHARE_SUCCESS, payload: returnShares },
      { type: types.GET_LIST }
    ];

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: returnShares
      });
    });

    const store = mockStore({ shares: {} });

    return store.dispatch(newShare(1, 'Share2')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('deleteShare will send delete, refresh shares and list', () => {
    const returnShares = [
      {
        name: 'Share1',
        id: 1
      },
      {
        name: 'Share2',
        id: 2
      }
    ];

    const expectedActions = [
      { type: types.DELETE_SHARE },
      { type: types.DELETE_SHARE_SUCCESS, payload: returnShares },
      { type: types.GET_LIST }
    ];

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: returnShares
      });
    });

    const store = mockStore({ shares: {} });

    return store.dispatch(deleteShare(1, 3)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

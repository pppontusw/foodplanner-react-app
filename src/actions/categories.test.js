import { mockStore } from './../../Utils';
import moxios from 'moxios';
import { getCategoriesByList, newCategory, deleteCategory } from './categories';
import * as types from './types';

describe('Categories action creators', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('getCategoriesByList will fetch categories', () => {
    const returnCategories = [
      {
        name: 'Category1',
        id: 1
      }
    ];

    const expectedActions = [
      { type: types.GET_CATEGORIES },
      { type: types.GET_CATEGORIES_SUCCESS, payload: returnCategories }
    ];

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: returnCategories
      });
    });

    const store = mockStore({ categories: {} });

    return store.dispatch(getCategoriesByList(1)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('newCategory will post new category, refresh category and list', () => {
    const returnCategories = [
      {
        name: 'Category1',
        id: 1
      },
      {
        name: 'Category2',
        id: 2
      }
    ];

    const expectedActions = [
      { type: types.NEW_CATEGORY },
      { type: types.NEW_CATEGORY_SUCCESS, payload: returnCategories },
      { type: types.GET_LIST }
    ];

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: returnCategories
      });
    });

    const store = mockStore({ categories: {} });

    return store.dispatch(newCategory(1, 'Category2')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('deleteCategory will send delete, refresh categories and list', () => {
    const returnCategories = [
      {
        name: 'Category1',
        id: 1
      },
      {
        name: 'Category2',
        id: 2
      }
    ];

    const expectedActions = [
      { type: types.DELETE_CATEGORY },
      { type: types.DELETE_CATEGORY_SUCCESS, payload: returnCategories },
      { type: types.GET_LIST }
    ];

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: returnCategories
      });
    });

    const store = mockStore({ categories: {} });

    return store.dispatch(deleteCategory(1, 3)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

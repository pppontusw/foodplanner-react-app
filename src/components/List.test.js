import React from 'react';
import { shallow } from 'enzyme';
import { findByDataTestAttr, testStore } from './../../Utils';
import ListConnected, { List } from './List';
import _ from 'lodash';

const setUp = (props = {}, initialState = {}) => {
  const store = testStore(initialState);
  const component = shallow(<ListConnected store={store} {...props} />)
    .childAt(0)
    .dive();
  return component;
};

const setUpWithoutStore = (props = {}) => {
  const component = shallow(<List {...props} />);
  return component;
};

const stateLists = {
  byId: {
    1: {
      name: 'List1',
      id: '1',
      days: [1, 2, 3, 4, 5, 6, 7]
    }
  },
  loading: false,
  firstFullLoad: false
};

const matchParamsId = {
  match: {
    params: {
      id: 1
    }
  }
};

describe('List Component (connected)', () => {
  let component;
  beforeEach(() => {
    component = setUp(matchParamsId, {
      lists: stateLists
    });
  });

  it('renders a list card', () => {
    const listCard = findByDataTestAttr(component, 'listCard');
    expect(listCard.length).toBe(1);
  });

  it('renders 7 days', () => {
    const dayComponent = findByDataTestAttr(component, 'dayComponent');
    expect(dayComponent.length).toBe(7);
  });

  it('renders back and forward navigation buttons', () => {
    const goForward = findByDataTestAttr(component, 'goForward');
    const goBack = findByDataTestAttr(component, 'goBack');
    expect(goForward.length).toBe(1);
    expect(goBack.length).toBe(1);
  });

  it('card is loading if lists are loading', () => {
    component = setUp(matchParamsId, {
      lists: {
        ...stateLists,
        loading: true
      }
    });
    const listCard = findByDataTestAttr(component, 'listCard');
    expect(listCard.prop('loading')).toBe(true);
  });

  it('card is loading if days are loading', () => {
    component = setUp(matchParamsId, {
      lists: stateLists,
      days: {
        loading: true
      }
    });
    const listCard = findByDataTestAttr(component, 'listCard');
    expect(listCard.prop('loading')).toBe(true);
  });

  it('card is loading if entries are loading', () => {
    component = setUp(matchParamsId, {
      lists: stateLists,
      entries: {
        loading: true
      }
    });
    const listCard = findByDataTestAttr(component, 'listCard');
    expect(listCard.prop('loading')).toBe(true);
  });
});

describe('List Component (without store)', () => {
  let component;
  let mockGetFoodsByList;
  let mockGetList;
  let mockGetDaysByList;
  let mockGetEntriesByList;
  beforeEach(() => {
    mockGetFoodsByList = jest.fn();
    mockGetList = jest.fn();
    mockGetDaysByList = jest.fn();
    mockGetEntriesByList = jest.fn();
    component = setUpWithoutStore({
      lists: stateLists.byId[1],
      getList: mockGetList,
      getFoodsByList: mockGetFoodsByList,
      getDaysByList: mockGetDaysByList,
      getEntriesByList: mockGetEntriesByList,
      loading: false,
      firstFullLoad: false,
      ...matchParamsId
    });
  });

  it('makes data calls when mounted', async () => {
    await component.instance().componentDidMount();
    expect(mockGetList).toBeCalled();
    expect(mockGetDaysByList).toBeCalled();
    expect(mockGetEntriesByList).toBeCalled();
    expect(mockGetFoodsByList).toBeCalled();
  });

  it('pageForward increments the page and calls for new data', () => {
    const classInstance = component.instance();

    expect(classInstance.state.page).toBe(0);
    expect(classInstance.state.visitedPages).toMatchObject([0]);

    classInstance.pageForward();
    expect(classInstance.state.page).toBe(1);
    expect(classInstance.state.visitedPages).toMatchObject([0, 1]);

    expect(mockGetList).toBeCalled();
    expect(mockGetDaysByList).toBeCalled();
    expect(mockGetEntriesByList).toBeCalled();
    expect(mockGetFoodsByList).toBeCalled();

    expect(mockGetList).toBeCalledWith(1, 1, false, false);
    expect(mockGetDaysByList).toBeCalledWith(1, 1, false, false);
    expect(mockGetEntriesByList).toBeCalledWith(1, 1, false, false);
    expect(mockGetFoodsByList).toBeCalledWith(1);
  });

  it('pageBack decrements the page and calls for new data', () => {
    const classInstance = component.instance();

    expect(classInstance.state.page).toBe(0);
    expect(classInstance.state.visitedPages).toMatchObject([0]);

    classInstance.pageBack();
    expect(classInstance.state.page).toBe(-1);
    expect(classInstance.state.visitedPages).toMatchObject([0, -1]);

    expect(mockGetList).toBeCalled();
    expect(mockGetDaysByList).toBeCalled();
    expect(mockGetEntriesByList).toBeCalled();
    expect(mockGetFoodsByList).toBeCalled();

    expect(mockGetList).toBeCalledWith(1, -1, false, false);
    expect(mockGetDaysByList).toBeCalledWith(1, -1, false, false);
    expect(mockGetEntriesByList).toBeCalledWith(1, -1, false, false);
    expect(mockGetFoodsByList).toBeCalledWith(1);
  });

  it('pageForward suppresses loading if page is already visited', () => {
    const classInstance = component.instance();

    classInstance.state.visitedPages = [0, 1];
    expect(classInstance.state.page).toBe(0);
    expect(classInstance.state.visitedPages).toMatchObject([0, 1]);

    classInstance.pageForward();
    expect(classInstance.state.page).toBe(1);
    expect(classInstance.state.visitedPages).toMatchObject([0, 1]);

    expect(mockGetList).toBeCalled();
    expect(mockGetDaysByList).toBeCalled();
    expect(mockGetEntriesByList).toBeCalled();
    expect(mockGetFoodsByList).toBeCalled();

    expect(mockGetList).toBeCalledWith(1, 1, false, true);
    expect(mockGetDaysByList).toBeCalledWith(1, 1, false, true);
    expect(mockGetEntriesByList).toBeCalledWith(1, 1, false, true);
    expect(mockGetFoodsByList).toBeCalledWith(1);
  });

  it('pageBack suppresses loading if page is already visited', () => {
    const classInstance = component.instance();

    classInstance.state.visitedPages = [0, -1];
    expect(classInstance.state.page).toBe(0);
    expect(classInstance.state.visitedPages).toMatchObject([0, -1]);

    classInstance.pageBack();
    expect(classInstance.state.page).toBe(-1);
    expect(classInstance.state.visitedPages).toMatchObject([0, -1]);

    expect(mockGetList).toBeCalled();
    expect(mockGetDaysByList).toBeCalled();
    expect(mockGetEntriesByList).toBeCalled();
    expect(mockGetFoodsByList).toBeCalled();

    expect(mockGetList).toBeCalledWith(1, -1, false, true);
    expect(mockGetDaysByList).toBeCalledWith(1, -1, false, true);
    expect(mockGetEntriesByList).toBeCalledWith(1, -1, false, true);
    expect(mockGetFoodsByList).toBeCalledWith(1);
  });
});

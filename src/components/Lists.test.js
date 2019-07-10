import React from 'react';
import { shallow } from 'enzyme';
import { findByDataTestAttr, testStore } from './../../Utils';
import ListsConnected, { Lists } from './Lists';
import _ from 'lodash';

const setUp = (props = {}, initialState = {}) => {
  const store = testStore(initialState);
  const component = shallow(<ListsConnected store={store} {...props} />)
    .childAt(0)
    .dive();
  return component;
};

const setUpWithoutStore = (props = {}) => {
  const component = shallow(<Lists {...props} />);
  return component;
};

const stateLists = {
  byId: {
    1: {
      name: 'List1',
      id: '1',
      days: [1, 2]
    },
    2: {
      name: 'List2',
      id: '2',
      days: [3, 4]
    },
    3: {
      name: 'List3',
      id: '3',
      days: [5, 6]
    }
  },
  loading: false,
  firstFullLoad: false
};

describe('Lists Component (connected)', () => {
  let component;
  beforeEach(() => {
    component = setUp(
      {},
      {
        lists: stateLists
      }
    );
  });

  it('renders 3 lists', () => {
    const listsCard = findByDataTestAttr(component, 'listsCard');
    expect(listsCard.length).toBe(3);
  });

  it('renders 6 days', () => {
    const dayComponent = findByDataTestAttr(component, 'dayComponent');
    expect(dayComponent.length).toBe(6);
  });

  it('renders a new list button', () => {
    const newListButton = findByDataTestAttr(component, 'newListButton');
    expect(newListButton.length).toBe(1);
  });

  it('renders a hidden new list modal', () => {
    const newListModal = findByDataTestAttr(component, 'newListModal');
    expect(newListModal.length).toBe(1);
    expect(newListModal.props().visible).toBe(false);
  });

  it('clicking new list button renders the modal', () => {
    const newListButton = findByDataTestAttr(component, 'newListButton');
    let newListModal = findByDataTestAttr(component, 'newListModal');
    expect(newListModal.length).toBe(1);
    expect(newListModal.props().visible).toBe(false);
    newListButton.simulate('click');
    newListModal = findByDataTestAttr(component, 'newListModal');
    expect(newListModal.length).toBe(1);
    expect(newListModal.props().visible).toBe(true);
  });

  it('renders the modal form and input', () => {
    // const mockFunc = jest.fn();
    // component.instance().onSubmit = mockFunc;
    // component.update();
    const modalForm = findByDataTestAttr(component, 'modalForm');
    expect(modalForm.length).toBe(1);
    expect(modalForm.prop('onSubmit')).toBe(component.instance().onSubmit);
    // expect(modalForm.props().contains('onSubmit')).toBe(true);
    const modalInput = findByDataTestAttr(component, 'modalInput');
    expect(modalInput.length).toBe(1);
  });

  it('opens the modal when createListClick is called', () => {
    const classInstance = component.instance();
    expect(classInstance.state.newListModalVisible).toBe(false);
    let newListModal = findByDataTestAttr(component, 'newListModal');
    expect(newListModal.props().visible).toBe(false);
    classInstance.createListClick();
    expect(classInstance.state.newListModalVisible).toBe(true);
    newListModal = findByDataTestAttr(component, 'newListModal');
    expect(newListModal.props().visible).toBe(true);
  });

  it('closes the modal when hideModal is called', () => {
    const classInstance = component.instance();
    classInstance.state.newListModalVisible = true;

    classInstance.forceUpdate();
    component.update();

    let newListModal = findByDataTestAttr(component, 'newListModal');
    expect(newListModal.props().visible).toBe(true);
    expect(classInstance.state.newListModalVisible).toBe(true);
    classInstance.hideModal();
    newListModal = findByDataTestAttr(component, 'newListModal');
    expect(newListModal.props().visible).toBe(false);
    expect(classInstance.state.newListModalVisible).toBe(false);
  });
});

describe('Lists Component (without store)', () => {
  let component;
  let mockCreateList;
  let mockGetLists;
  let mockGetDays;
  let mockGetEntries;
  beforeEach(() => {
    mockCreateList = jest.fn();
    mockGetLists = jest.fn();
    mockGetDays = jest.fn();
    mockGetEntries = jest.fn();
    component = setUpWithoutStore({
      lists: _.values(stateLists.byId),
      createList: mockCreateList,
      getLists: mockGetLists,
      getDays: mockGetDays,
      getEntries: mockGetEntries,
      loading: false,
      firstFullLoad: false
    });
  });

  it('onSubmit calls createList correctly, resets state and hides modal', () => {
    const classInstance = component.instance();
    classInstance.state.listname = 'TestList';
    classInstance.state.newListModalVisible = true;
    expect(classInstance.state.newListModalVisible).toBe(true);
    classInstance.onSubmit({ preventDefault: () => {} });
    expect(classInstance.state.newListModalVisible).toBe(false);
    expect(classInstance.state.listname).toBe('');
    expect(mockCreateList).toBeCalled();
    expect(mockCreateList).toBeCalledWith('TestList');
  });

  it('makes data calls when mounted', async () => {
    await component.instance().componentDidMount();
    expect(mockGetLists).toBeCalled();
    expect(mockGetDays).toBeCalled();
    expect(mockGetEntries).toBeCalled();
    expect(mockGetLists).toBeCalledWith(0, 2);
    expect(mockGetDays).toBeCalledWith(0, 2);
    expect(mockGetEntries).toBeCalledWith(0, 2);
  });
});

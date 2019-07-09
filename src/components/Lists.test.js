import React from 'react';
import { shallow } from 'enzyme';
import { findByDataTestAttr, testStore } from './../../Utils';
import Lists from './Lists';

const setUp = (props = {}, initialState = {}) => {
  const store = testStore(initialState);
  const component = shallow(<Lists store={store} {...props} />)
    .childAt(0)
    .dive();
  // console.log(component.debug());
  return component;
};

describe('Lists Component', () => {
  let component;
  let mockFunc;
  beforeEach(() => {
    mockFunc = jest.fn();
    component = setUp(
      { createList: mockFunc },
      {
        lists: {
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
        }
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
    classInstance.createListClick();
    expect(classInstance.state.newListModalVisible).toBe(true);
  });

  it('closes the modal when hideModal is called', () => {
    const classInstance = component.instance();
    classInstance.state.newListModalVisible = true;
    expect(classInstance.state.newListModalVisible).toBe(true);
    classInstance.hideModal();
    expect(classInstance.state.newListModalVisible).toBe(false);
  });

  // it('calls createList correctly and resets state onSubmit', () => {
  //   const classInstance = component.instance();
  //   // classInstance.props.createList = mockFunc;
  //   // component.update();
  //   classInstance.state.listname = 'TestList';
  //   classInstance.state.newListModalVisible = true;
  //   expect(classInstance.state.newListModalVisible).toBe(true);
  //   // expect(classInstance.props.createList).toBe(mockFunc);
  //   classInstance.onSubmit({ preventDefault: () => {} });
  //   // console.log(store);
  //   expect(classInstance.state.newListModalVisible).toBe(false);
  //   expect(classInstance.state.listname).toBe('');
  //   expect(mockFunc).toBeCalled();
  //   expect(mockFunc).toBeCalledWith('TestList');
  // });
});

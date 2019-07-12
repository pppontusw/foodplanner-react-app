import React from 'react';
import { shallow } from 'enzyme';
import { findByDataTestAttr, testStore } from './../../../Utils';
import FoodSettingsConnected, { FoodSettings } from './FoodSettings';
import { DragableBodyRow } from '../Helpers/BodyRow';

const props = {
  listId: 1
};

const stateLists = {
  byId: {
    1: {
      name: 'List1',
      id: '1',
      days: [1, 2, 3, 4, 5, 6, 7],
      foods: [1, 2, 3, 4],
      categories: [1, 2, 3]
    }
  }
};

const stateFoods = {
  byId: {
    1: {
      name: 'Food1',
      id: '1',
      categories: [1]
    },
    2: {
      name: 'Food2',
      id: '2',
      categories: [1]
    },
    3: {
      name: 'Food3',
      id: '3',
      categories: []
    },
    4: {
      name: 'Food4',
      id: '4',
      categories: [3]
    }
  },
  loading: false,
  updatingFood: false
};

const stateCategories = {
  byId: {
    1: {
      name: 'Category1',
      id: '1'
    },
    2: {
      name: 'Category2',
      id: '2'
    },
    3: {
      name: 'Category3',
      id: '3'
    }
  },
  loading: false
};

const stateAuth = {
  user: {
    user: 'testUser'
  }
};

const setUp = (props = {}, initialState = {}) => {
  const store = testStore(initialState);
  const component = shallow(<FoodSettingsConnected store={store} {...props} />)
    .childAt(0)
    .dive();
  //   console.log(component.debug());
  return component;
};

describe('FoodSettings component (redux connected)', () => {
  let component;
  beforeEach(() => {
    component = setUp(props, {
      lists: stateLists,
      foods: stateFoods,
      categories: stateCategories,
      auth: stateAuth
    });
  });

  it('renders without crashing', () => {
    const foodSettingsWrapper = findByDataTestAttr(
      component,
      'foodSettingsWrapper'
    );

    expect(foodSettingsWrapper.length).toBe(1);
  });

  it('renders invisible editFoodModal with a button to edit name', () => {
    const editFoodModal = findByDataTestAttr(component, 'editFoodModal');

    expect(editFoodModal.length).toBe(1);
    expect(editFoodModal.prop('visible')).toBe(false);
    expect(
      editFoodModal.prop('title').props.children[1].props['data-test']
    ).toBe('startEditingFoodNameButton');
  });

  it('renders addCategoryForm in editFoodModal with select field', () => {
    const addCategoryForm = findByDataTestAttr(component, 'addCategoryForm');
    const selectCategories = findByDataTestAttr(component, 'selectCategories');

    expect(addCategoryForm.length).toBe(1);
    expect(selectCategories.length).toBe(1);
  });

  it('editFoodModal has the correct functions', () => {
    const editFoodModal = findByDataTestAttr(component, 'editFoodModal');
    const instance = component.instance();

    expect(editFoodModal.prop('visible')).toBe(false);
    expect(editFoodModal.prop('onOk')).toBe(instance.handleModalOk);
    expect(editFoodModal.prop('onCancel')).toBe(instance.handleModalCancel);
  });

  it('renders newFoodForm with correct onSubmit', () => {
    const newFoodForm = findByDataTestAttr(component, 'newFoodForm');
    const instance = component.instance();

    expect(newFoodForm.length).toBe(1);
    expect(newFoodForm.prop('onSubmit')).toBe(instance.onSubmit);
  });

  it('renders newFoodInput with an Icon that can be clicked to submit', () => {
    const newFoodInput = findByDataTestAttr(component, 'newFoodInput');
    const instance = component.instance();

    expect(newFoodInput.length).toBe(1);
    expect(newFoodInput.prop('addonAfter').props.onClick).toBe(
      instance.onSubmit
    );
  });

  it('renders foodSettingsTable with 4 foods', () => {
    const foodSettingsTable = findByDataTestAttr(
      component,
      'foodSettingsTable'
    );

    expect(foodSettingsTable.length).toBe(1);
    expect(foodSettingsTable.props().dataSource.length).toBe(4);
    expect(
      foodSettingsTable.props().columns[1].render(0, {
        categories: [{ name: 'Cat1', color: 'blue', key: 1 }]
      }).props.children[0].props.children
    ).toBe('Cat1');
  });

  it('renders category in column', () => {
    const foodSettingsTable = findByDataTestAttr(
      component,
      'foodSettingsTable'
    );

    expect(
      foodSettingsTable.props().columns[1].render(0, {
        categories: [{ name: 'Cat1', color: 'blue', key: 1 }]
      }).props.children[0].props.children
    ).toBe('Cat1');
  });
});

const setUpWithoutStore = (props = {}) => {
  const component = shallow(<FoodSettings {...props} />);
  return component;
};

const mappedFoods = [
  {
    name: 'Food1',
    id: 1,
    key: 0,
    categories: [
      {
        name: 'Category1',
        id: '1'
      }
    ]
  },
  {
    name: 'Food2',
    id: 2,
    key: 1,
    categories: [{ name: 'Category1', id: '1' }, { name: 'Category2', id: '2' }]
  },
  { name: 'Food3', id: 3, key: 2, categories: [] },
  { name: 'Food4', id: 4, key: 3, categories: [{ name: 'Category2', id: '2' }] }
];

describe('FoodSettings (no store)', () => {
  let component;
  const mockGetFoodsByList = jest.fn();
  const mockGetCategoriesByList = jest.fn();
  const mockNewFood = jest.fn();
  const mockDeleteFood = jest.fn();
  const mockPutFood = jest.fn();
  beforeEach(() => {
    component = setUpWithoutStore({
      list: stateLists.byId[1],
      foods: mappedFoods,
      username: 'user1',
      loading: false,
      getFoodsByList: mockGetFoodsByList,
      getCategoriesByList: mockGetCategoriesByList,
      newFood: mockNewFood,
      deleteFood: mockDeleteFood,
      putFood: mockPutFood,
      ...props
    });
  });

  it('gets data when mounted', async () => {
    await component.instance().componentDidMount();
    expect(mockGetFoodsByList).toBeCalled();
    expect(mockGetCategoriesByList).toBeCalled();
    expect(mockGetFoodsByList).toBeCalledWith(1);
    expect(mockGetCategoriesByList).toBeCalledWith(1);
  });

  it('copies data to local state when modal is opened', () => {
    const instance = component.instance();
    instance.openModal(mappedFoods[0]);
    expect(instance.state.modalVisible).toBe(true);
    expect(instance.state.modalFoodName).toBe('Food1');
    expect(instance.state.originalModalFoodName).toBe('Food1');
    expect(instance.state.modalFoodId).toBe(1);
    expect(instance.state.modalFoodCategories).toEqual(['Category1']);
  });

  it('clearFoodModalFromState wipes out local state', () => {
    const instance = component.instance();
    instance.clearFoodModalFromState();
    expect(instance.state.modalVisible).toBe(false);
    expect(instance.state.editingFoodName).toBe(false);
    expect(instance.state.modalFoodName).toBe('');
    expect(instance.state.originalModalFoodName).toBe('');
    expect(instance.state.modalFoodId).toBe('');
    expect(instance.state.modalFoodCategories).toEqual([]);
  });

  it('handleModalCancel calls clear modal from state', () => {
    const instance = component.instance();
    const mockFunc = jest.fn();
    instance.clearFoodModalFromState = mockFunc;
    instance.handleModalCancel();
    expect(mockFunc).toBeCalled();
  });

  it('deleteFood calls the action deleteFood', () => {
    const instance = component.instance();
    instance.deleteFood(3);
    expect(mockDeleteFood).toBeCalled();
    expect(mockDeleteFood).toBeCalledWith(1, 3);
  });

  it('saveFoodName saves over originalModalFoodName', () => {
    const instance = component.instance();
    instance.state.modalFoodName = 'NewName';
    instance.saveFoodName();
    expect(instance.state.originalModalFoodName).toBe('NewName');
  });

  it('onSubmit creates a new food and empties the new food name', () => {
    const instance = component.instance();
    instance.state.new_food = 'NewFood';
    instance.onSubmit({ preventDefault: jest.fn() });
    expect(instance.state.new_food).toBe('');
    expect(mockNewFood).toBeCalled();
    expect(mockNewFood).toBeCalledWith(1, 'NewFood');
  });

  it('changes state correctly when onChange is called', () => {
    const instance = component.instance();

    instance.onChange({
      target: {
        name: 'modalFoodName',
        value: 'something'
      }
    });

    expect(instance.state.modalFoodName).toBe('something');
  });

  it('cancelEditingFoodName copies back original name', () => {
    const instance = component.instance();
    instance.state.originalModalFoodName = 'OrigName';
    instance.cancelEditingFoodName();
    expect(instance.state.modalFoodName).toBe('OrigName');
  });

  it('startEditingFoodname lets you edit the food name', () => {
    const instance = component.instance();
    instance.startEditingFoodName();

    instance.forceUpdate();
    expect(instance.state.editingFoodName).toBe(true);

    const editFoodModal = findByDataTestAttr(component, 'editFoodModal');

    expect(
      editFoodModal.prop('title').props.children[0].props['data-test']
    ).toBe('editingFoodNameInput');

    expect(
      editFoodModal.prop('title').props.children[1].props['data-test']
    ).toBe('editingFoodNameSaveButton');

    expect(
      editFoodModal.prop('title').props.children[2].props['data-test']
    ).toBe('editingFoodNameCancelButton');

    expect(editFoodModal.prop('title').props.children[1].props['onClick']).toBe(
      instance.saveFoodName
    );

    expect(editFoodModal.prop('title').props.children[2].props['onClick']).toBe(
      instance.cancelEditingFoodName
    );
  });

  it('handleModalOk spawns a redux action and clears out local state', () => {
    const instance = component.instance();
    const mockFunc = jest.fn();
    instance.state.modalFoodName = 'NewName';
    instance.state.modalFoodId = 1;
    instance.state.modalFoodCategories = ['NewCat'];
    instance.clearFoodModalFromState = mockFunc;
    instance.handleModalOk();
    expect(mockFunc).toBeCalled();
    expect(mockPutFood).toBeCalled();
    expect(mockPutFood).toBeCalledWith(1, {
      name: 'NewName',
      id: 1,
      categories: ['NewCat']
    });
  });

  it('handleModalCategoryChange puts new values into modalFoodCategories', () => {
    const instance = component.instance();

    instance.handleModalCategoryChange(['Test1', 'Test2']);
    expect(instance.state.modalFoodCategories).toEqual(['Test1', 'Test2']);
  });

  it('renders loading when loading', () => {
    component = setUpWithoutStore({ loading: true });

    const loadingCard = findByDataTestAttr(component, 'loadingCard');
    expect(loadingCard.length).toBe(1);
  });
});

import React from 'react';
import { shallow } from 'enzyme';
import { findByDataTestAttr, testStore } from './../../../Utils';
import CategorySettingsConnected, {
  CategorySettings
} from './CategorySettings';

const props = {
  listId: 1
};

const stateLists = {
  byId: {
    1: {
      name: 'List1',
      id: '1',
      days: [1, 2, 3, 4, 5, 6, 7],
      categories: [1, 2, 3]
    }
  }
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
  const component = shallow(
    <CategorySettingsConnected store={store} {...props} />
  )
    .childAt(0)
    .dive();
  //   console.log(component.debug());
  return component;
};

describe('CategorySettings component (redux connected)', () => {
  let component;
  beforeEach(() => {
    component = setUp(props, {
      lists: stateLists,
      categories: stateCategories,
      auth: stateAuth
    });
  });

  it('renders without crashing', () => {
    const categoryList = findByDataTestAttr(component, 'categoryList');
    // console.log(component.debug());
    expect(categoryList.length).toBe(1);
  });

  it('has 3 categories in List dataSource', () => {
    const categoryList = findByDataTestAttr(component, 'categoryList');
    expect(categoryList.prop('dataSource').length).toBe(3);
  });

  it('renders new category form and input', () => {
    const newCategoryForm = findByDataTestAttr(component, 'newCategoryForm');
    const newCategoryInput = findByDataTestAttr(component, 'newCategoryInput');
    expect(newCategoryForm.length).toBe(1);
    expect(newCategoryInput.length).toBe(1);
    expect(newCategoryForm.prop('onSubmit')).toBe(
      component.instance().onSubmit
    );
    expect(newCategoryInput.prop('onChange')).toBe(
      component.instance().onChange
    );
  });

  it('List renderitem renders the correct list item', () => {
    const categoryList = findByDataTestAttr(component, 'categoryList');
    expect(
      categoryList.prop('renderItem')(stateLists.byId[1]).props['data-test']
    ).toBe('listItem');
    expect(
      categoryList.prop('renderItem')(stateLists.byId[1]).props.children
    ).toBe('List1');
  });

  it('List renderitem renders a delete button', () => {
    const categoryList = findByDataTestAttr(component, 'categoryList');
    expect(
      categoryList.prop('renderItem')(stateLists.byId[1]).props.actions[0]
        .props['data-test']
    ).toBe('popConfirmDelete');
  });
});

const setUpWithoutStore = (props = {}) => {
  const component = shallow(<CategorySettings {...props} />);
  return component;
};

const mappedCategories = [
  {
    name: 'Category1',
    id: 1,
    key: 0
  },
  {
    name: 'Category2',
    id: 2,
    key: 1
  }
];

describe('CategorySettings (no store)', () => {
  let component;
  const mockNewCategory = jest.fn();
  const mockDeleteCategory = jest.fn();
  const mockGetCategoriesByList = jest.fn();
  beforeEach(() => {
    component = setUpWithoutStore({
      list: stateLists.byId[1],
      categories: mappedCategories,
      username: 'user1',
      loading: false,
      newCategory: mockNewCategory,
      deleteCategory: mockDeleteCategory,
      getCategoriesByList: mockGetCategoriesByList,
      ...props
    });
  });

  it('gets data when mounted', async () => {
    await component.instance().componentDidMount();
    expect(mockGetCategoriesByList).toBeCalled();
    expect(mockGetCategoriesByList).toBeCalledWith(1);
  });

  it('shows a loadingCard when loading', () => {
    component = setUpWithoutStore({ loading: true });
    const loadingCard = findByDataTestAttr(component, 'loadingCard');
    expect(loadingCard.length).toBe(1);
  });

  it('deleteCategory triggers redux action', () => {
    component.instance().deleteCategory(1);
    expect(mockDeleteCategory).toBeCalled();
    expect(mockDeleteCategory).toBeCalledWith(1, 1);
  });

  it('onSubmit triggers new category creation', () => {
    const instance = component.instance();
    instance.state.newCategory = 'NewCat';
    instance.onSubmit({ preventDefault: jest.fn() });
    expect(mockNewCategory).toBeCalled();
    expect(mockNewCategory).toBeCalledWith(1, 'NewCat');
    expect(instance.state.newCategory).toBe('');
  });

  it('changes state correctly when onChange is called', () => {
    const instance = component.instance();

    instance.onChange({
      target: {
        name: 'newCategory',
        value: 'something'
      }
    });

    expect(instance.state.newCategory).toBe('something');
  });
});

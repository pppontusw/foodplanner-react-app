import React from 'react';
import { shallow } from 'enzyme';
import { findByDataTestAttr, testStore } from './../../../Utils';
import ListSettingsConnected, { ListSettings } from './index';

const setUp = (props = {}, initialState = {}) => {
  const store = testStore(initialState);
  const component = shallow(<ListSettingsConnected store={store} {...props} />)
    .childAt(0)
    .dive();
  // console.log(component.debug());
  return component;
};

const setUpWithoutStore = (props = {}) => {
  const component = shallow(<ListSettings {...props} />);
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
  firstFullLoad: false,
  updatingTitle: false
};
const props = {
  match: {
    params: {
      id: 1
    }
  }
};

describe('ListSettings Component (connected)', () => {
  let component;
  beforeEach(() => {
    component = setUp(props, {
      lists: stateLists
    });
  });

  it('renders a listSettingsCard', () => {
    const listSettingsCard = findByDataTestAttr(component, 'listSettingsCard');
    expect(listSettingsCard.length).toBe(1);
    expect(listSettingsCard.prop('title').props.children[0]).toBe('List1');
  });

  it('renders a viewSettingsTab', () => {
    const viewSettingsTab = findByDataTestAttr(component, 'viewSettingsTab');
    expect(viewSettingsTab.length).toBe(1);
  });

  it('renders a mealSettingsTab', () => {
    const mealSettingsTab = findByDataTestAttr(component, 'mealSettingsTab');
    expect(mealSettingsTab.length).toBe(1);
  });

  it('renders a foodSettingsTab', () => {
    const foodSettingsTab = findByDataTestAttr(component, 'foodSettingsTab');
    expect(foodSettingsTab.length).toBe(1);
  });

  it('renders a categorySettingsTab', () => {
    const categorySettingsTab = findByDataTestAttr(
      component,
      'categorySettingsTab'
    );
    expect(categorySettingsTab.length).toBe(1);
  });

  it('renders a shareSettingsTab', () => {
    const shareSettingsTab = findByDataTestAttr(component, 'shareSettingsTab');
    expect(shareSettingsTab.length).toBe(1);
  });

  it('renders a backToListButton', () => {
    const backToListButton = findByDataTestAttr(component, 'backToListButton');
    expect(backToListButton.length).toBe(1);
  });

  it('renders a cardTitleEditButton', () => {
    const listSettingsCard = findByDataTestAttr(component, 'listSettingsCard');
    expect(
      listSettingsCard.prop('title').props.children[1].props['data-test']
    ).toBe('cardTitleEditButton');
  });

  it('cardTitleEditButton click triggers startEdit', () => {
    const listSettingsCard = findByDataTestAttr(component, 'listSettingsCard');
    expect(
      listSettingsCard.prop('title').props.children[1].props['onClick']
    ).toBe(component.instance().startEdit);
  });
});

describe('ListSettings Component (without store)', () => {
  let component;
  let mockGetList;
  let mockGetSharesByList;
  let mockRenameList;
  beforeEach(() => {
    mockGetList = jest.fn();
    mockGetSharesByList = jest.fn();
    mockRenameList = jest.fn();
    component = setUpWithoutStore({
      list: stateLists.byId[1],
      foods: ['Penne', 'Fusilli'],
      getList: mockGetList,
      getSharesByList: mockGetSharesByList,
      renameList: mockRenameList,
      loading: false,
      updatingTitle: false,
      ...props
    });
  });

  it('sets editing and title when startEdit is called', () => {
    const instance = component.instance();

    instance.startEdit();

    expect(instance.state.editingListTitle).toBe(true);
    expect(instance.state.listTitle).toBe('List1');
  });

  it('calls for data when mounted', async () => {
    await component.instance().componentDidMount();
    expect(mockGetList).toBeCalled();
    expect(mockGetSharesByList).toBeCalled();
    expect(mockGetList).toBeCalledWith(1);
    expect(mockGetSharesByList).toBeCalledWith(1);
  });

  it('renders save and revert buttons when editing is true', () => {
    const instance = component.instance();
    instance.state.editingListTitle = true;

    expect(instance.state.editingListTitle).toBe(true);

    // don't really understand why both these are needed to force render here
    // found from https://github.com/airbnb/enzyme/issues/1229
    // even though state has updated, the component does not re-render :(
    instance.forceUpdate();
    component.update();

    const listSettingsCard = findByDataTestAttr(component, 'listSettingsCard');

    // Because these are wrapped in Fragments and inside a property of
    // the Antd Card, we go drilling for them
    const listTitleInput = listSettingsCard.prop('title').props.children[0];
    expect(listTitleInput.props['data-test']).toBe('listTitleInput');
    expect(listTitleInput.props['onPressEnter']).toBe(instance.saveTitle);

    // Because these are wrapped in Fragments and inside a property of
    // the Antd Card, we go drilling for them
    const saveTitle = listSettingsCard.prop('title').props.children[1];
    expect(saveTitle.props['data-test']).toBe('saveTitle');
    expect(saveTitle.props['onClick']).toBe(instance.saveTitle);

    // Because these are wrapped in Fragments and inside a property of
    // the Antd Card, we go drilling for them
    const cancelEditing = listSettingsCard.prop('title').props.children[2];
    expect(cancelEditing.props['data-test']).toBe('cancelEditing');
    expect(cancelEditing.props['onClick']).toBe(instance.cancelEditing);
  });

  //   it('updates the entry on save', () => {
  //     const instance = component.instance();

  //     instance.state.editing = true;
  //     instance.state.value = 'NewValue';

  //     component.update();

  //     instance.saveEntry();

  //     expect(instance.state.editing).toBe(false);
  //     expect(instance.state.orig_value).toBe('NewValue');
  //     expect(mockUpdateEntry).toBeCalled();
  //     expect(mockUpdateEntry).toBeCalledWith('1', 'NewValue');
  //   });

  //   it('updates the entry onSelect', () => {
  //     const instance = component.instance();

  //     instance.state.editing = true;

  //     component.update();

  //     instance.onSelect('NewValue', {});

  //     expect(instance.state.editing).toBe(false);
  //     expect(instance.state.orig_value).toBe('NewValue');
  //     expect(mockUpdateEntry).toBeCalled();
  //     expect(mockUpdateEntry).toBeCalledWith('1', 'NewValue');
  //   });

  //   it('reverts the entry on revert', () => {
  //     const instance = component.instance();

  //     instance.state.editing = true;
  //     instance.state.orig_value = 'RevertedValue';

  //     component.update();

  //     instance.revertEntry();

  //     expect(instance.state.editing).toBe(false);
  //     expect(instance.state.value).toBe('RevertedValue');
  //   });
});

import React from 'react';
import { shallow } from 'enzyme';
import { findByDataTestAttr, testStore } from './../../../Utils';
import ShareSettingsConnected, { ShareSettings } from './ShareSettings';

const props = {
  listId: 1
};

const stateLists = {
  byId: {
    1: {
      name: 'List1',
      id: '1',
      days: [1, 2, 3, 4, 5, 6, 7],
      shares: [1, 2],
      is_owner: true
    }
  }
};

const stateShares = {
  byId: {
    1: {
      username: 'user1',
      id: '1',
      permission_level: 'owner'
    },
    2: {
      username: 'user2',
      id: '2',
      permission_level: 'member'
    }
  },
  loading: false
};

const stateAuth = {
  user: {
    user: 'user1'
  }
};

const setUp = (props = {}, initialState = {}) => {
  const store = testStore(initialState);
  const component = shallow(<ShareSettingsConnected store={store} {...props} />)
    .childAt(0)
    .dive();
  //   console.log(component.debug());
  return component;
};

describe('ShareSettings (redux connected)', () => {
  let component;
  beforeEach(() => {
    component = setUp(props, {
      lists: stateLists,
      shares: stateShares,
      auth: stateAuth
    });
  });

  it('renders without crashing', () => {
    const shareList = findByDataTestAttr(component, 'shareList');
    // console.log(component.debug());
    expect(shareList.length).toBe(1);
  });

  it('has 2 shares in List dataSource', () => {
    const shareList = findByDataTestAttr(component, 'shareList');
    expect(shareList.prop('dataSource').length).toBe(2);
  });

  it('renders new category form and input', () => {
    const newShareForm = findByDataTestAttr(component, 'newShareForm');
    const newShareInput = findByDataTestAttr(component, 'newShareInput');
    expect(newShareForm.length).toBe(1);
    expect(newShareInput.length).toBe(1);
    expect(newShareForm.prop('onSubmit')).toBe(component.instance().onSubmit);
    expect(newShareInput.prop('onChange')).toBe(component.instance().onChange);
  });

  it('List renderitem renders the correct list item', () => {
    const shareList = findByDataTestAttr(component, 'shareList');
    expect(
      shareList.prop('renderItem')(stateShares.byId[1]).props['data-test']
    ).toBe('shareListItem');
    expect(
      shareList.prop('renderItem')(stateShares.byId[1]).props.children[1]
    ).toBe('user1');
  });

  it('List renderitem renders a delete button if the user is a member (not owner)', () => {
    const shareList = findByDataTestAttr(component, 'shareList');

    expect(
      shareList.prop('renderItem')(stateShares.byId[2]).props.actions[0].props[
        'data-test'
      ]
    ).toBe('popConfirmDelete');

    expect(
      shareList.prop('renderItem')(stateShares.byId[1]).props.actions
    ).toEqual([]);
  });
});

const setUpWithoutStore = (props = {}) => {
  const component = shallow(<ShareSettings {...props} />);
  return component;
};

const mappedShares = [
  {
    username: 'user1',
    id: '1',
    permission_level: 'owner'
  },
  {
    username: 'user2',
    id: '2',
    permission_level: 'member'
  }
];

describe('ShareSettings (no store)', () => {
  let component;
  const mockNewShare = jest.fn();
  const mockDeleteShare = jest.fn();
  beforeEach(() => {
    component = setUpWithoutStore({
      list: stateLists.byId[1],
      shares: mappedShares,
      username: 'user1',
      loading: false,
      newShare: mockNewShare,
      deleteShare: mockDeleteShare,
      ...props
    });
  });

  it('shows a loadingCard when loading', () => {
    component = setUpWithoutStore({ loading: true });
    const loadingCard = findByDataTestAttr(component, 'loadingCard');
    expect(loadingCard.length).toBe(1);
  });

  it('deleteShare triggers redux action', () => {
    component.instance().deleteShare(1);
    expect(mockDeleteShare).toBeCalled();
    expect(mockDeleteShare).toBeCalledWith(1, 1);
  });

  it('onSubmit triggers new category creation', () => {
    const instance = component.instance();
    instance.state.new_share = 'NewShare';
    instance.onSubmit({ preventDefault: jest.fn() });
    expect(mockNewShare).toBeCalled();
    expect(mockNewShare).toBeCalledWith(1, 'NewShare');
    expect(instance.state.new_share).toBe('');
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

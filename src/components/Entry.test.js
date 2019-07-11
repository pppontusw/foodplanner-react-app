import React from 'react';
import { shallow } from 'enzyme';
import { findByDataTestAttr, testStore } from './../../Utils';
import EntryConnected, { Entry } from './Entry';

const setUp = (props = {}, initialState = {}) => {
  const store = testStore(initialState);
  const component = shallow(<EntryConnected store={store} {...props} />)
    .childAt(0)
    .dive();
  return component;
};

const setUpWithoutStore = (props = {}) => {
  const component = shallow(<Entry {...props} />);
  return component;
};

const stateEntries = {
  byId: {
    1: {
      key: 'Lunch',
      id: '1',
      value: 'Spaghetti'
    },
    2: {
      key: 'Dinner',
      id: '2',
      value: ''
    }
  },
  loading: false,
  firstFullLoad: false
};

const stateLists = {
  byId: {
    1: {
      name: 'List1',
      id: '1',
      foods: [1, 2]
    }
  },
  loading: false,
  firstFullLoad: false
};

const stateFoods = {
  byId: {
    1: {
      name: 'Penne',
      id: '1'
    },
    2: {
      name: 'Fusilli',
      id: '2'
    }
  },
  loading: false
};

const props = {
  entryId: 1,
  listId: 1
};

describe('Entry Component (connected)', () => {
  let component;
  beforeEach(() => {
    component = setUp(props, {
      lists: stateLists,
      entries: stateEntries,
      foods: stateFoods
    });
  });

  it('renders an entryRow', () => {
    const entryRow = findByDataTestAttr(component, 'entryRow');
    expect(entryRow.length).toBe(1);
  });

  it('renders entryKey and it contains the text Lunch', () => {
    const entryKey = findByDataTestAttr(component, 'entryKey');
    expect(entryKey.length).toBe(1);
    expect(entryKey.text().includes('Lunch')).toBe(true);
  });

  it('renders a startEditButton', () => {
    const startEditButton = findByDataTestAttr(component, 'startEditButton');
    expect(startEditButton.length).toBe(1);
    expect(startEditButton.prop('onClick')).toBe(
      component.instance().startEdit
    );
  });

  it('renders a entryValue and it contains Spaghetti', async () => {
    await component.instance().componentDidMount();

    const entryValue = findByDataTestAttr(component, 'entryValue');
    expect(entryValue.length).toBe(1);
    expect(entryValue.text().includes('Spaghetti')).toBe(true);
  });

  it('renders nothing if there is no entries', async () => {
    component = setUp(props, {
      entries: {
        byId: {}
      }
    });
    await component.instance().componentDidMount();
    const entryValue = findByDataTestAttr(component, 'entryValue');
    expect(entryValue.length).toBe(0);
  });

  it('handles if foods are missing', () => {
    component = setUp(props, {
      lists: stateLists,
      entries: stateEntries,
      foods: {
        byId: {}
      }
    });
    const entryValue = findByDataTestAttr(component, 'entryValue');
    expect(entryValue.length).toBe(1);
  });

  it('handles if entry has no value (sets it to empty)', async () => {
    component = setUp(
      { ...props, entryId: 2 },
      {
        lists: stateLists,
        entries: stateEntries,
        foods: {
          byId: {}
        }
      }
    );
    await component.instance().componentDidMount();
    const entryValue = findByDataTestAttr(component, 'entryValue');
    expect(entryValue.length).toBe(1);
    expect(entryValue.text().includes('Empty')).toBe(true);
  });
});

describe('List Component (without store)', () => {
  let component;
  let mockUpdateEntry;
  beforeEach(() => {
    mockUpdateEntry = jest.fn();
    component = setUpWithoutStore({
      entry: stateEntries.byId[1],
      foods: ['Penne', 'Fusilli'],
      updateEntry: mockUpdateEntry,
      loading: false,
      firstFullLoad: false,
      ...props
    });
  });

  it('renders AutoComplete field and focuses it when startEdit is called', () => {
    const mockFunc = jest.fn();
    const instance = component.instance();
    instance.myRef = {
      current: {
        focus: mockFunc
      }
    };
    instance.startEdit();
    expect(instance.state.editing).toBe(true);
    component.update();
    const entryAutoComplete = findByDataTestAttr(
      component,
      'entryAutoComplete'
    );
    expect(entryAutoComplete.length).toBe(1);
    expect(mockFunc).toBeCalled();
  });

  it('renders save and revert buttons when editing is true', () => {
    const instance = component.instance();
    instance.state.editing = true;

    expect(instance.state.editing).toBe(true);
    // don't really understand why both these are needed to force render here
    // found from https://github.com/airbnb/enzyme/issues/1229
    // even though state has updated, the component does not re-render :(
    instance.forceUpdate();
    component.update();

    const saveEntryButton = findByDataTestAttr(component, 'saveEntryButton');
    expect(saveEntryButton.length).toBe(1);
    expect(saveEntryButton.prop('onClick')).toBe(
      component.instance().saveEntry
    );

    const revertEntryButton = findByDataTestAttr(
      component,
      'revertEntryButton'
    );
    expect(revertEntryButton.length).toBe(1);
    expect(revertEntryButton.prop('onClick')).toBe(
      component.instance().revertEntry
    );
  });

  it('updates the entry on save', () => {
    const instance = component.instance();

    instance.state.editing = true;
    instance.state.value = 'NewValue';

    component.update();

    instance.saveEntry();

    expect(instance.state.editing).toBe(false);
    expect(instance.state.orig_value).toBe('NewValue');
    expect(mockUpdateEntry).toBeCalled();
    expect(mockUpdateEntry).toBeCalledWith('1', 'NewValue');
  });

  it('updates the entry onSelect', () => {
    const instance = component.instance();

    instance.state.editing = true;

    component.update();

    instance.onSelect('NewValue', {});

    expect(instance.state.editing).toBe(false);
    expect(instance.state.orig_value).toBe('NewValue');
    expect(mockUpdateEntry).toBeCalled();
    expect(mockUpdateEntry).toBeCalledWith('1', 'NewValue');
  });

  it('changes state correctly when onChange is called', () => {
    const instance = component.instance();

    instance.onChange('something');

    expect(instance.state.value).toBe('something');
  });

  it('reverts the entry on revert', () => {
    const instance = component.instance();

    instance.state.editing = true;
    instance.state.orig_value = 'RevertedValue';

    component.update();

    instance.revertEntry();

    expect(instance.state.editing).toBe(false);
    expect(instance.state.value).toBe('RevertedValue');
  });
});

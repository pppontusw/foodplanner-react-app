import React from 'react';
import { shallow } from 'enzyme';
import { findByDataTestAttr, testStore } from './../../../Utils';
import MealSettingsConnected, { MealSettings } from './MealSettings';
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
      meals: [1, 2]
    }
  }
};

const stateMeals = {
  byId: {
    1: {
      name: 'Meal1',
      id: '1'
    },
    2: {
      name: 'Meal2',
      id: '2'
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
  const component = shallow(<MealSettingsConnected store={store} {...props} />)
    .childAt(0)
    .dive();
  // console.log(component.debug());
  return component;
};

describe('MealSettings component (redux connected)', () => {
  let component;
  beforeEach(() => {
    component = setUp(props, {
      lists: stateLists,
      meals: stateMeals,
      auth: stateAuth
    });
  });

  it('renders without crashing', () => {
    const mealSettingsWrapper = findByDataTestAttr(
      component,
      'mealSettingsWrapper'
    );

    expect(mealSettingsWrapper.length).toBe(1);
  });

  it('renders addMealForm', () => {
    const addMealForm = findByDataTestAttr(component, 'addMealForm');
    expect(addMealForm.length).toBe(1);
  });

  it('renders newMealInput with correct functions', () => {
    const newMealInput = findByDataTestAttr(component, 'newMealInput');
    const instance = component.instance();
    expect(newMealInput.length).toBe(1);
    expect(newMealInput.prop('addonAfter').props['onClick']).toBe(
      instance.onSubmit
    );
    expect(newMealInput.prop('onChange')).toBe(instance.onChange);
  });

  it('renders newMealInput values correctly', () => {
    const instance = component.instance();
    instance.state.new_meal = 'NewMeal';

    instance.forceUpdate();

    const newMealInput = findByDataTestAttr(component, 'newMealInput');
    expect(newMealInput.prop('value')).toBe('NewMeal');
  });

  it('renders mealSettingsTable correctly', () => {
    const mealSettingsTable = findByDataTestAttr(
      component,
      'mealSettingsTable'
    );
    // console.log(mealSettingsTable.prop('columns'));

    expect(mealSettingsTable.length).toBe(1);
  });

  it('renders popConfirm when you want to delete a meal', () => {
    const mealSettingsTable = findByDataTestAttr(
      component,
      'mealSettingsTable'
    );

    expect(
      mealSettingsTable.prop('columns')[1].render().props['data-test']
    ).toBe('popConfirmDelete');

    // yikes, this is not pretty, but matching anonymous functions
    // turned out to be really hard..
    // const onConfirm = '() => this.deleteMeal(record.id)';
    // expect(
    //   mealSettingsTable
    //     .prop('columns')[1]
    //     .render()
    //     .props['onConfirm'].toString()
    // ).toBe(onConfirm);
  });

  it('mealSettingsTable component body -> row is DragableBodyRow', () => {
    const mealSettingsTable = findByDataTestAttr(
      component,
      'mealSettingsTable'
    );

    expect(mealSettingsTable.prop('components').body.row).toBe(DragableBodyRow);
  });

  it('renders without crashing if meals is empty', () => {
    const component = setUp(props, {
      lists: stateLists,
      meals: { byId: {} },
      auth: stateAuth
    });

    const mealSettingsWrapper = findByDataTestAttr(
      component,
      'mealSettingsWrapper'
    );

    expect(mealSettingsWrapper.length).toBe(1);
  });

  it('onChange updates the event values', () => {
    const instance = component.instance();

    instance.onChange({
      target: {
        name: 'new_meal',
        value: 'NewMeal'
      }
    });

    expect(instance.state.new_meal).toBe('NewMeal');
  });
});

const setUpWithoutStore = (props = {}) => {
  const component = shallow(<MealSettings {...props} />);
  return component;
};

describe('ListSettings Component (without store)', () => {
  let component;
  const mockNewMeal = jest.fn();
  const mockDeleteMeal = jest.fn();
  const mockGetMealsByList = jest.fn();
  const mockPutMeals = jest.fn();
  beforeEach(() => {
    component = setUpWithoutStore({
      list: stateLists.byId[1],
      meals: ['Meal1', 'Meal2', 'Meal3', 'Meal4'],
      username: 'user1',
      loading: false,
      newMeal: mockNewMeal,
      deleteMeal: mockDeleteMeal,
      getMealsByList: mockGetMealsByList,
      putMeals: mockPutMeals,
      ...props
    });
  });

  it('calls for data when mounted', async () => {
    await component.instance().componentDidMount();

    expect(mockGetMealsByList).toBeCalled();
    expect(mockGetMealsByList).toBeCalledWith(1);
  });

  it('renders loading when loading', () => {
    component = setUpWithoutStore({
      loading: true,
      ...props
    });

    const loadingCard = findByDataTestAttr(component, 'loadingCard');
    expect(loadingCard.length).toBe(1);
  });

  it('deleteMeal calls deleteMeal action', () => {
    component.instance().deleteMeal(1);
    expect(mockDeleteMeal).toBeCalled();
    expect(mockDeleteMeal).toBeCalledWith(1, 1);
  });

  it('onSubmit creates a newMeal action and rests state', () => {
    const instance = component.instance();
    instance.state.new_meal = 'NewMeal';

    instance.onSubmit({ preventDefault: jest.fn() });

    expect(mockNewMeal).toBeCalled();
    expect(mockNewMeal).toBeCalledWith(1, 'NewMeal');
    expect(instance.state.new_meal).toBe('');
  });

  it('moveRow shuffles rows and puts the new data', () => {
    component.instance().moveRow(3, 1);
    expect(mockPutMeals).toBeCalled();
    expect(mockPutMeals).toBeCalledWith(1, [
      'Meal1',
      'Meal4',
      'Meal2',
      'Meal3'
    ]);
    component.instance().moveRow(0, 3);
    expect(mockPutMeals).toBeCalled();
    expect(mockPutMeals).toBeCalledWith(1, [
      'Meal2',
      'Meal3',
      'Meal4',
      'Meal1'
    ]);
  });
});

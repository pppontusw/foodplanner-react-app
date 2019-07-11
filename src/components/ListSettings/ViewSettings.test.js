import React from 'react';
import { shallow } from 'enzyme';
import { findByDataTestAttr, testStore } from './../../../Utils';
import ViewSettingsConnected, {
  ViewSettings,
  WrappedViewSettingsForm
} from './ViewSettings';

const props = {
  listId: 1
};

const stateLists = {
  byId: {
    1: {
      name: 'List1',
      id: '1',
      days: [1, 2, 3, 4, 5, 6, 7],
      meals: [1, 2],
      settings: {
        days_to_display: 7,
        start_day_of_week: 'Today'
      }
    }
  }
};

const setUp = (props = {}, initialState = {}) => {
  const store = testStore(initialState);
  const component = shallow(<ViewSettingsConnected store={store} {...props} />)
    .childAt(0)
    .dive();
  //   console.log(component.debug());
  return component;
};

const setUpNoStore = (props = {}) => {
  const component = shallow(<ViewSettings {...props} />);
  return component;
};

describe('MealSettings component (connected, through form)', () => {
  let component;
  beforeEach(() => {
    component = setUp(props, {
      lists: stateLists
    });
  });

  it('mapStateToProps works', () => {
    expect(component.instance().props.list).toBe(stateLists.byId[1]);
  });
});

describe('MealSettings component (redux connected, through antd form wrapper)', () => {
  let component;

  // Mocks getFieldDecorator from ant form wrapper
  //   const mockFunc = jest.fn(opts => c => c);
  //   const mockFormFieldDeco = {
  //     getFieldDecorator: mockFunc,
  //     validateFields: jest.fn(opts => c => ({}, (false, { test: 'test' })))
  //   };

  const mockPutListSettings = jest.fn();
  beforeEach(() => {
    component = setUpNoStore({
      ...props,
      //   form: mockFormFieldDeco,
      putListSettings: mockPutListSettings,
      list: stateLists.byId[1]
    });
  });

  it('renders without crashing', () => {
    const viewSettingsForm = findByDataTestAttr(component, 'viewSettingsForm');
    expect(viewSettingsForm.length).toBe(1);
  });

  it('renders a submit button', () => {
    const submitButton = findByDataTestAttr(component, 'submitButton');
    expect(submitButton.length).toBe(1);
  });

  it('renders 8 day options', () => {
    const dayOption = findByDataTestAttr(component, 'dayOption');
    expect(dayOption.length).toBe(8);
  });

  it('renders 21 value options', () => {
    const valueOption = findByDataTestAttr(component, 'valueOption');
    expect(valueOption.length).toBe(21);
  });

  it('renders loadingCard when loading', () => {
    component = setUpNoStore({
      loading: true
    });
    const loadingCard = findByDataTestAttr(component, 'loadingCard');
    expect(loadingCard.length).toBe(1);
  });

  it('onSubmit puts new settings', () => {
    const instance = component.instance();

    instance.state.days_to_display = 10;
    instance.state.start_day_of_week = 'Friday';

    instance.onSubmit({ preventDefault: jest.fn() });

    expect(mockPutListSettings).toBeCalled();
    expect(mockPutListSettings).toBeCalledWith(1, 10, 'Friday');
  });

  it('onSubmit puts new settings also if no state has been put', () => {
    const instance = component.instance();

    instance.onSubmit({ preventDefault: jest.fn() });

    expect(mockPutListSettings).toBeCalled();
    expect(mockPutListSettings).toBeCalledWith(1, 7, 'Today');
  });

  it('changeStartDay works', () => {
    const instance = component.instance();

    instance.changeStartDay('Test');

    expect(instance.state.start_day_of_week).toBe('Test');
  });

  it('changeDaysToDisplay works', () => {
    const instance = component.instance();

    instance.changeDaysToDisplay('TestG');

    expect(instance.state.days_to_display).toBe('TestG');
  });
});

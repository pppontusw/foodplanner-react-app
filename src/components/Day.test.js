import React from 'react';
import { shallow } from 'enzyme';
import { findByDataTestAttr, testStore } from './../../Utils';
import DayConnected from './Day';

const setUp = (compProps = {}, initialState = {}) => {
  const store = testStore(initialState);
  const component = shallow(<DayConnected store={store} {...compProps} />)
    .childAt(0)
    .dive();
  return component;
};

const stateDays = {
  byId: {
    1: {
      day: '2019-02-03 00:00',
      id: '1',
      entries: [1, 2]
    }
  },
  loading: false,
  firstFullLoad: false
};

const props = {
  dayId: 1
};

describe('Day Component (connected)', () => {
  let component;
  beforeEach(() => {
    component = setUp(props, {
      days: stateDays
    });
  });

  it('renders a day card', () => {
    const dayCard = findByDataTestAttr(component, 'dayCard');
    expect(dayCard.length).toBe(1);
  });

  it('renders 2 entries', () => {
    const entryComponent = findByDataTestAttr(component, 'entryComponent');
    expect(entryComponent.length).toBe(2);
  });

  it('renders nothing if there is no days', () => {
    component = setUp(props, {
      days: {
        byId: {}
      }
    });
  });
});

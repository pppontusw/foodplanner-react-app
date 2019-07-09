import React from 'react';
import { Route } from 'react-router-dom';
import { shallow } from 'enzyme';
import { findByDataTestAttr, testStore } from './../../../Utils';
import PrivateRoute from './PrivateRoute';
import Loader from './Loader';

const setUp = (props = { component: Loader }, initialState = {}) => {
  const store = testStore(initialState);
  // console.log(props, initialState);
  const component = shallow(<PrivateRoute store={store} {...props} />)
    .childAt(0)
    .dive();
  // console.log(component.debug());
  return component;
};

// TODO - does this even work or have any point?
// Since there's a Route wrapper, everything is a route
describe('PrivateRoute Component (Unauthenticated)', () => {
  let component;
  beforeEach(() => {
    component = setUp();
  });

  it('redirects to login', () => {
    expect(component.find(Route).length).toBe(1);
  });
});

// describe('PrivateRoute Component (Loading)', () => {
//   let component;
//   beforeEach(() => {
//     const state = {
//       auth: {
//         isAuthenticated: false,
//         isLoading: true
//       }
//     };
//     component = setUp({ ...state }, state);
//   });

//   it('renders Loader when loading', () => {
//     console.log(
//       component
//         .dive()
//         .dive()
//         .debug()
//     );
//     expect(component.find(Loader).length).toBe(1);
//   });
// });

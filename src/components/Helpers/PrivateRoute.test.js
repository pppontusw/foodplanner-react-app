import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { shallow } from 'enzyme';
import { testStore, fakeComponent } from './../../../Utils';
import PrivateRouteConnected, { PrivateRoute } from './PrivateRoute';
import Loader from './Loader';

const setUp = (props = { component: fakeComponent }, initialState = {}) => {
  const store = testStore(initialState);
  const component = shallow(<PrivateRouteConnected store={store} {...props} />)
    .childAt(0)
    .dive();
  return component;
};

// TODO - does this even work or have any point?
// Since there's a Route wrapper, everything is a route
describe('PrivateRoute Component (mapStateToProps)', () => {
  let component;
  beforeEach(() => {
    component = setUp();
  });

  it('renders using mapStateToProps', () => {
    expect(component.find(Route).length).toBe(1);
  });
});

const propsLoggedIn = {
  component: fakeComponent,
  auth: {
    isAuthenticated: true,
    isLoading: false
  }
};

const propsLoggedOut = {
  component: fakeComponent,
  auth: {
    isAuthenticated: false,
    isLoading: false
  }
};

const propsLoading = {
  component: fakeComponent,
  auth: {
    isAuthenticated: true,
    isLoading: true
  }
};

const setUpNoStore = (props = { component: fakeComponent }) => {
  const component = shallow(<PrivateRoute {...props} />);
  return component;
};

describe('PrivateRoute Component (No Redux)', () => {
  it('renders the fake component when authenticated', () => {
    const component = setUpNoStore(propsLoggedIn);
    expect(component.prop('render')().type).toBe(fakeComponent);
  });

  it('renders the loader when loading', () => {
    const component = setUpNoStore(propsLoading);
    expect(component.prop('render')().type).toBe(Loader);
  });

  it('redirects to login page when not logged in', () => {
    const component = setUpNoStore(propsLoggedOut);
    expect(component.prop('render')().type).toBe(Redirect);
    expect(component.prop('render')().props.to).toBe('/login');
  });
});

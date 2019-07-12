// import checkPropTypes from 'check-prop-types';
import React from 'react';
import { applyMiddleware, createStore } from 'redux';
import rootReducer from './../src/reducers';
import { middleware } from './../src/store';
import configureMockStore from 'redux-mock-store';
import { Card } from 'antd';

export const findByDataTestAttr = (component, attr) => {
  const wrapper = component.find(`[data-test='${attr}']`);
  return wrapper;
};

export const fakeComponent = () => {
  return <Card data-test="fakeComponent" />;
};

export const testStore = initialState => {
  const createStoreWithMiddleware = applyMiddleware(...middleware)(createStore);
  return createStoreWithMiddleware(rootReducer, initialState);
};

const middlewares = middleware;
export const mockStore = configureMockStore(middlewares);

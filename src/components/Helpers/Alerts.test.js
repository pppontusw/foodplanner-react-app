import React from 'react';
import { shallow } from 'enzyme';
import { testStore } from './../../../Utils';
import Alerts from './Alerts';

const setUp = (props = {}, initialState = {}) => {
  const store = testStore(initialState);
  const component = shallow(<Alerts store={store} {...props} />)
    .childAt(0)
    .dive();
  return component;
};

describe('Alerts (Errors)', () => {
  let component;
  beforeEach(() => {
    component = setUp(
      {},
      {
        errors: {
          msg: {
            message: 'TestError'
          },
          status: 400
        }
      }
    );
  });
  it("this test doesn't work", () => {
    // this test entirely doesn't work at the moment,
    // I haven't figured out how to access the notifications
    // created by the antd notification API
    // probably I'll revisit it later
  });
});

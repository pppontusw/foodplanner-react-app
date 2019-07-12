import React from 'react';
import { shallow } from 'enzyme';
import { BodyRow, rowSource, rowTarget } from './BodyRow';

const setUpWithoutStore = (props = {}) => {
  const component = shallow(<BodyRow {...props} />);
  return component;
};

describe('Body Row component', () => {
  let component;
  const mockConnectDragSource = jest.fn();
  const mockConnectDropTarget = jest.fn();

  let props = {
    isOver: true,
    connectDragSource: mockConnectDragSource,
    connectDropTarget: mockConnectDropTarget,
    index: -3
  };

  it('renders without error', () => {
    setUpWithoutStore(props);
    expect(mockConnectDragSource).toBeCalled();
    expect(mockConnectDropTarget).toBeCalled();
  });

  it('renders without error when restProps.index > dragingIndex', () => {
    props = {
      ...props,
      index: 3,
      className: 'test'
    };
    setUpWithoutStore(props);
    expect(mockConnectDragSource).toBeCalled();
    expect(mockConnectDropTarget).toBeCalled();
  });

  it('renders without error when restProps.index < dragingIndex', () => {
    props = {
      ...props,
      index: -3
    };
    setUpWithoutStore(props);
    expect(mockConnectDragSource).toBeCalled();
    expect(mockConnectDropTarget).toBeCalled();
  });

  it('can do rowSource.beginDrag()', () => {
    const dragIndex = rowSource.beginDrag(props);
    expect(dragIndex.index).toBe(-3);
  });

  it('can do rowTarget.drop()', () => {
    const mockMoveRow = jest.fn();
    props = {
      ...props,
      moveRow: mockMoveRow
    };
    const monitorMockFunc = jest.fn();

    const mockMonitor = {
      getItem: monitorMockFunc
    };

    monitorMockFunc.mockReturnValueOnce({ index: -3 });
    const returnNone = rowTarget.drop(props, mockMonitor);
    expect(returnNone).toBe(undefined);

    const monitorMockFuncAgain = jest.fn();
    const mockMonitorAgain = {
      getItem: monitorMockFuncAgain
    };
    monitorMockFuncAgain.mockReturnValueOnce({ index: 3 });
    monitorMockFuncAgain.mockReturnValueOnce({ index: 3 });

    rowTarget.drop(props, mockMonitorAgain);
    expect(mockMoveRow).toBeCalled();
    expect(monitorMockFuncAgain).toHaveBeenCalledTimes(2);
  });
});

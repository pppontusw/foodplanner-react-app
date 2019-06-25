import React, { Component } from 'react';
import { connect } from 'react-redux';

export class ShareSettings extends Component {
  render() {
    return <div>{this.props.shares}</div>;
  }
}

export default connect((state, props) => {
  const list = state.lists.byId[props.list_id];

  return {
    shares: list.shares
  };
})(ShareSettings);

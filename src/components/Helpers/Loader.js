import React, { Component } from 'react';
import { Spin } from 'antd';

class Loader extends Component {
  render() {
    return (
      <div
        data-test="loaderDiv"
        style={{ textAlign: 'center', marginTop: '10px' }}
      >
        <Spin data-test="spinner" size="large" />
      </div>
    );
  }
}

export default Loader;

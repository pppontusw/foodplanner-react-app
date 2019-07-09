import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';
import { Form, Button, Icon, Input } from 'antd';

class Login extends Component {
  state = {
    username: '',
    password: ''
  };

  static propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
  };

  onSubmit = e => {
    e.preventDefault();
    this.props.login(this.state.username, this.state.password);
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />;
    }
    const { username, password } = this.state;
    return (
      <Form
        data-test="loginForm"
        onSubmit={this.onSubmit}
        style={{ maxWidth: '500px', margin: '20px auto' }}
      >
        <h3 className="text-center">Sign in</h3>
        <Form.Item>
          <Input
            data-test="username"
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Username"
            name="username"
            onChange={this.onChange}
            value={username}
          />
        </Form.Item>
        <Form.Item>
          <Input
            data-test="password"
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Password"
            name="password"
            type="password"
            onChange={this.onChange}
            value={password}
          />
        </Form.Item>
        <Form.Item>
          {/* <Checkbox>Remember me</Checkbox> */}
          <Button
            data-test="loginButton"
            type="primary"
            htmlType="submit"
            className="login-form-button"
            style={{ width: '100%' }}
          >
            Log in
          </Button>
          <Link
            data-test="forgotPassword"
            className="login-form-forgot"
            to="/forgot"
          >
            Forgot password
          </Link>
          <Link data-test="register" to="/register" style={{ float: 'right' }}>
            Or register now!
          </Link>
        </Form.Item>
      </Form>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { login }
)(Login);

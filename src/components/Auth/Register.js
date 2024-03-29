import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register } from '../../actions/auth';
import { createMessage } from '../../actions/messages';
import { Form, Button, Input, Card } from 'antd';

export class Register extends Component {
  state = {
    username: '',
    email: '',
    firstname: '',
    lastname: '',
    password: '',
    password2: ''
  };

  static propTypes = {
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
  };

  onSubmit = e => {
    e.preventDefault();
    const {
      username,
      email,
      firstname,
      lastname,
      password,
      password2
    } = this.state;
    if (password !== password2) {
      this.props.createMessage({ passwordNotMatch: 'Passwords do not match' });
    } else {
      const newUser = {
        username,
        firstname,
        lastname,
        password,
        email
      };
      this.props.register(newUser);
    }
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />;
    }
    const {
      username,
      email,
      firstname,
      lastname,
      password,
      password2
    } = this.state;
    return (
      <Card
        style={{
          margin: '20px auto',
          maxWidth: '500px'
        }}
      >
        <Form
          data-test="registerForm"
          onSubmit={this.onSubmit}
          layout="horizontal"
        >
          <h2 className="text-center">Register</h2>
          <Form.Item className="form-group">
            <Input
              data-test="username"
              type="text"
              className="form-control"
              name="username"
              onChange={this.onChange}
              value={username}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item className="form-group">
            <Input
              data-test="email"
              type="email"
              className="form-control"
              name="email"
              onChange={this.onChange}
              value={email}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item className="form-group">
            <Input
              data-test="firstname"
              type="text"
              className="form-control"
              name="firstname"
              onChange={this.onChange}
              value={firstname}
              placeholder="Firstname"
            />
          </Form.Item>
          <Form.Item>
            <Input
              data-test="lastname"
              type="text"
              className="form-control"
              name="lastname"
              onChange={this.onChange}
              value={lastname}
              placeholder="Lastname"
            />
          </Form.Item>
          <Form.Item>
            <Input
              data-test="password"
              type="password"
              className="form-control"
              name="password"
              onChange={this.onChange}
              value={password}
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Input
              data-test="password2"
              // prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              className="form-control"
              name="password2"
              onChange={this.onChange}
              value={password2}
              placeholder="Confirm Password"
            />
          </Form.Item>
          <Form.Item>
            <Button
              data-test="registerSubmitButton"
              type="primary"
              htmlType="submit"
              style={{ width: '100%' }}
            >
              Register
            </Button>
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </Form.Item>
        </Form>
      </Card>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { register, createMessage }
)(Register);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateUser } from '../../actions/auth';
import { createMessage } from '../../actions/messages';
import { Form, Button, Input } from 'antd';

class Profile extends Component {
  state = {
    username: '',
    email: '',
    firstname: '',
    lastname: '',
    password: '',
    password2: ''
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
      const updatedUser = {
        username,
        firstname,
        lastname,
        password,
        email
      };
      this.props.updateUser(this.props.user.id, updatedUser);
    }
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  componentDidMount() {
    const { username, email, firstname, lastname } = this.props.user;
    this.setState({
      username,
      email,
      firstname,
      lastname
    });
  }

  render() {
    const {
      username,
      email,
      firstname,
      lastname,
      password,
      password2
    } = this.state;
    return (
      <Form
        data-test="profileForm"
        onSubmit={this.onSubmit}
        layout="horizontal"
        style={{ maxWidth: '800px', margin: '20px auto' }}
      >
        <h2 className="text-center">Update user</h2>
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
            data-test="profileSubmitButton"
            type="primary"
            htmlType="submit"
            style={{ width: '100%' }}
          >
            Update Profile
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default connect(
  state => {
    return {
      isAuthenticated: state.auth.isAuthenticated,
      user: state.auth.user
    };
  },
  { updateUser, createMessage }
)(Profile);

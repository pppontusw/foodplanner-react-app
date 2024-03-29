import React, { Component } from 'react';
import { connect } from 'react-redux';

import { List, Tag, Icon, Form, Input, Popconfirm, Card } from 'antd';
import { newShare, deleteShare } from '../../actions/shares';

// todo this could be a selector (reselect)
const sharesMap = (list, shares) => {
  let newShares = [];
  const oldShares = list ? list.shares : [];

  if (list) {
    newShares = oldShares.map((share_id, index) => {
      const share = shares.byId[share_id];
      if (share) {
        return {
          username: share.username,
          id: share_id,
          permission_level: share.permission_level
        };
      } else {
        return {
          id: share_id
        };
      }
    });
  }
  return newShares;
};

export class ShareSettings extends Component {
  state = {
    new_share: ''
  };

  onSubmit = e => {
    e.preventDefault();
    const new_user = this.state.new_share;
    this.props.newShare(this.props.listId, new_user);
    this.setState({ new_share: '' });
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  deleteShare = id => {
    this.props.deleteShare(this.props.listId, id);
  };

  render() {
    if (this.props.loading) {
      return <Card data-test="loadingCard" loading={this.props.loading} />;
    }
    return (
      <div>
        <List
          data-test="shareList"
          header={<strong>Shared with</strong>}
          bordered
          dataSource={this.props.shares}
          renderItem={item => (
            <List.Item
              data-test="shareListItem"
              key={item.id}
              actions={
                item.permission_level === 'member' && this.props.list.is_owner
                  ? [
                      <Popconfirm
                        data-test="popConfirmDelete"
                        title="Are you sure you want to delete this share?"
                        onConfirm={() => this.deleteShare(item.id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Icon
                          type="user-delete"
                          // theme="twoTone"
                          // twoToneColor="#d63737"
                          style={{ fontSize: '16px' }}
                        />
                      </Popconfirm>
                    ]
                  : []
              }
            >
              {item.permission_level === 'member' ? (
                <Tag key={item.id} color="cyan" style={{ marginRight: '10px' }}>
                  Member
                </Tag>
              ) : (
                [
                  <Tag key={item.id} color="cyan">
                    Owner
                  </Tag>
                ]
              )}
              {item.username}
            </List.Item>
          )}
        />
        <br />
        {this.props.list && this.props.list.is_owner ? (
          <Form
            data-test="newShareForm"
            layout="vertical"
            onSubmit={this.onSubmit}
          >
            <Form.Item>
              <Input
                data-test="newShareInput"
                placeholder="Add another user"
                name="new_share"
                onChange={this.onChange}
                value={this.state.new_share}
                addonAfter={<Icon type="plus" onClick={this.onSubmit} />}
              />
            </Form.Item>
          </Form>
        ) : null}
      </div>
    );
  }
}

export default connect(
  (state, props) => {
    const list = state.lists.byId[props.listId];
    const loading = state.shares.loading;

    return {
      list: list,
      shares: sharesMap(list, state.shares),
      username: state.auth.user.user,
      loading
    };
  },
  { newShare, deleteShare }
)(ShareSettings);

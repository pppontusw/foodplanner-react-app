import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Select, Button, Icon, Card } from 'antd';
import { putListSettings } from '../../actions/lists';

const { Option } = Select;

export class ViewSettings extends Component {
  state = {
    days_to_display: false,
    start_day_of_week: false
  };
  onSubmit = e => {
    e.preventDefault();
    let { days_to_display, start_day_of_week } = this.state;
    const { listId } = this.props;

    if (!days_to_display) {
      days_to_display = this.props.list.settings.days_to_display;
    }

    if (!start_day_of_week) {
      start_day_of_week = this.props.list.settings.start_day_of_week;
    }

    this.props.putListSettings(listId, days_to_display, start_day_of_week);
  };

  changeStartDay = value => this.setState({ start_day_of_week: value });

  changeDaysToDisplay = value => this.setState({ days_to_display: value });

  render() {
    if (this.props.loading) {
      return <Card data-test="loadingCard" loading={this.props.loading} />;
    }

    const { days_to_display, start_day_of_week } =
      this.props.list.settings || {};

    return (
      <Form data-test="viewSettingsForm" onSubmit={this.onSubmit}>
        <Form.Item label="Number of days to display">
          <Select
            defaultValue={days_to_display}
            onChange={this.changeDaysToDisplay}
            name="days_to_display"
          >
            {[...Array(21)].map((x, i) => (
              <Option data-test="valueOption" value={i + 3} key={i + 3}>
                {i + 3}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Start day of the week">
          <Select
            defaultValue={start_day_of_week}
            onChange={this.changeStartDay}
            name="start_day_of_week"
          >
            <Option data-test="dayOption" value="Today">
              Today
            </Option>
            <Option data-test="dayOption" value="Monday">
              Monday
            </Option>
            <Option data-test="dayOption" value="Tuesday">
              Tuesday
            </Option>
            <Option data-test="dayOption" value="Wednesday">
              Wednesday
            </Option>
            <Option data-test="dayOption" value="Thursday">
              Thursday
            </Option>
            <Option data-test="dayOption" value="Friday">
              Friday
            </Option>
            <Option data-test="dayOption" value="Saturday">
              Saturday
            </Option>
            <Option data-test="dayOption" value="Sunday">
              Sunday
            </Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button
            data-test="submitButton"
            htmlType="submit"
            onClick={this.onSubmit}
            type="primary"
          >
            <Icon type="save" /> Save
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default connect(
  (state, props) => {
    const list = state.lists.byId[props.listId];
    const loading = state.lists.loading;

    return {
      list,
      loading
    };
  },
  { putListSettings }
)(ViewSettings);

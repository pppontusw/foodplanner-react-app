import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Card } from 'antd';
import Entry from './Entry';

export class Day extends Component {
  render() {
    const { day } = this.props;
    if (!day) {
      return null;
    }
    return (
      <React.Fragment key={day.id}>
        <Card
          data-test="dayCard"
          style={{ marginTop: '16px' }}
          type="inner"
          title={moment.utc(day.day).format('dddd')}
          extra={moment.utc(day.day).format('MMM Do')}>
          {day.entries.map((entry, entry_index) => (
            <Entry
              data-test="entryComponent"
              key={entry}
              editAllowed={this.props.editAllowed}
              listId={this.props.listId}
              entryId={entry}
              isMobile={this.props.isMobile}
            />
          ))}
        </Card>
      </React.Fragment>
    );
  }
}

export default connect(
  (state, props) => {
    const dayId = props.dayId;
    return {
      day: state.days.byId[dayId]
    };
  },
  null
)(Day);

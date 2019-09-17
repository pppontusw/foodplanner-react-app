import React, {Component} from 'react';
import {connect} from 'react-redux';
import {getList} from '../actions/lists';
import {getDaysByList} from '../actions/days';
import {getEntriesByList} from '../actions/entries';
import {getFoodsByList} from '../actions/foods';
import {Link} from 'react-router-dom';
import Day from './Day';
import {Card, Button, Icon} from 'antd';

export class List extends Component {
  state = {
    page: 0,
    visitedPages: [0],
    windowWidth: window.innerWidth,
  };

  componentDidMount() {
    this.props.getList(this.props.match.params.id, this.state.page);
    this.props.getDaysByList(this.props.match.params.id, this.state.page);
    this.props.getEntriesByList(this.props.match.params.id, this.state.page);
    this.props.getFoodsByList(this.props.match.params.id);
    window.addEventListener('resize', this.handleWindowSizeChange);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }

  handleWindowSizeChange = () => {
    this.setState({windowWidth: window.innerWidth});
  };

  refreshData = suppressLoading => {
    this.props.getList(
      this.props.match.params.id,
      this.state.page,
      false,
      suppressLoading,
    );
    this.props.getDaysByList(
      this.props.match.params.id,
      this.state.page,
      false,
      suppressLoading,
    );
    this.props.getEntriesByList(
      this.props.match.params.id,
      this.state.page,
      false,
      suppressLoading,
    );
    this.props.getFoodsByList(this.props.match.params.id);
  };

  pageBack = () => {
    let suppressLoading = true;
    const {page, visitedPages} = this.state;
    const newPage = page - 1;
    if (!visitedPages.includes(newPage)) {
      visitedPages.push(newPage);
      suppressLoading = false;
    }
    this.setState({page: newPage, visitedPages: visitedPages}, () => {
      this.refreshData(suppressLoading);
    });
  };

  pageForward = () => {
    let suppressLoading = true;
    const {page, visitedPages} = this.state;
    const newPage = page + 1;
    if (!visitedPages.includes(newPage)) {
      visitedPages.push(newPage);
      suppressLoading = false;
    }
    this.setState({page: newPage, visitedPages: visitedPages}, () => {
      this.refreshData(suppressLoading);
    });
  };

  render() {
    const {loading, list} = this.props;

    const isMobile = this.state.windowWidth <= 500;

    return (
      <div>
        <Card
          data-test="listCard"
          loading={loading}
          title={list ? list.name : null}
          style={{margin: '10px 10px', maxWidth: '600px'}}
          extra={
            // TODO extract to functional subcomponent and unit test(?)
            list ? (
              <Link to={`/list_settings/${list.id}`}>
                <Button data-test="listSettingsLink">
                  <Icon type="setting" />
                </Button>
              </Link>
            ) : null
          }>
          {this.props.list
            ? this.props.list.days.map((day, day_index) => (
                <Day
                  data-test="dayComponent"
                  key={day}
                  listId={this.props.list.id}
                  editAllowed={true}
                  dayId={day}
                  isMobile={isMobile}
                />
              ))
            : null}

          <div style={{display: 'flex'}}>
            <Button
              data-test="goForward"
              style={{marginRight: 'auto', marginTop: '20px'}}
              onClick={this.pageBack}>
              <Icon type="left-circle" />
            </Button>
            <Button
              data-test="goBack"
              style={{marginLeft: 'auto', marginTop: '20px'}}
              onClick={this.pageForward}>
              <Icon type="right-circle" />
            </Button>
          </div>
        </Card>
      </div>
    );
  }
}

export default connect(
  (state, props) => {
    const list = state.lists.byId[props.match.params.id];
    const listLoading =
      state.lists.loading || state.days.loading || state.entries.loading;

    return {
      list,
      loading: listLoading,
    };
  },
  {getList, getDaysByList, getEntriesByList, getFoodsByList},
)(List);

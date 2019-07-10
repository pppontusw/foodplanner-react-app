import React, { Component, Fragment } from 'react';
// import { Provider as AlertProvider } from 'react-alert';
// import AlertTemplate from 'react-alert-template-basic';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import Lists from './components/Lists';
import Alerts from './components/Helpers/Alerts';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import List from './components/List';
import Nav from './components/Layout/Nav';
import PrivateRoute from './components/Helpers/PrivateRoute';
import ListSettings from './components/ListSettings';
import Profile from './components/Auth/Profile';

import { Provider } from 'react-redux';
import { store } from './store';
import { loadUser } from './actions/auth';

class App extends Component {
  componentWillMount() {
    store.dispatch(loadUser());
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <Fragment>
            <Nav data-test="navComponent" />
            <div data-test="appDiv">
              <Alerts data-test="alertsComponent" />
              <Switch>
                <PrivateRoute
                  data-test="routeIndex"
                  exact
                  path="/"
                  component={Lists}
                />
                <Route
                  data-test="routeLogin"
                  exact
                  path="/login"
                  component={Login}
                />
                <Route
                  data-test="routeRegister"
                  exact
                  path="/register"
                  component={Register}
                />
                <PrivateRoute
                  data-test="routeList"
                  path="/list/:id"
                  component={List}
                />
                <PrivateRoute
                  data-test="routeProfile"
                  path="/profile"
                  component={Profile}
                />
                <PrivateRoute
                  data-test="routeListSettings"
                  path="/list_settings/:id"
                  component={ListSettings}
                />
              </Switch>
            </div>
          </Fragment>
        </Router>
      </Provider>
    );
  }
}

export default App;

import React, { Component } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import "react-redux-notify/dist/ReactReduxNotify.css";
import "./App.scss";
import configureStore from "./store/configureStore.js";

// Containers
import { Layout } from "./containers";
// Pages
import { Login, Page404, Page500, Register } from "./views/Pages";

// import { renderRoutes } from 'react-router-config';

const store = configureStore({});

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <HashRouter>
          <Switch>
            <Route exact path="/login" name="Login Page" component={Login} />
            <Route
              exact
              path="/register"
              name="Register Page"
              component={Register}
            />
            <Route exact path="/404" name="Page 404" component={Page404} />
            <Route exact path="/500" name="Page 500" component={Page500} />
            <Route path="/" name="Home" component={Layout} />
          </Switch>
        </HashRouter>
      </Provider>
    );
  }
}

export default App;

import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { whyDidYouUpdate } from "why-did-you-update";

import configureStore from "./store/configureStore.js";
// Styles
// Import Flag Icons Set
// import "flag-icon-css/css/flag-icon.min.css";
// Import Font Awesome Icons Set
import "font-awesome/css/font-awesome.min.css";
// Import Simple Line Icons Set
import "simple-line-icons/css/simple-line-icons.css";
// Import Main styles for this application
import "../scss/style.scss";
// Temp fix for reactstrap
import "../scss/core/_dropdown-menu-right.scss";

// Containers
import Full from "./containers/Full/";
const store = configureStore({});



// console.log("process.env.NODE_ENV:");
// console.log(process.env.NODE_ENV);
// Variable injected with Webpack's DefinePlugin
if (
  typeof process.env.NODE_ENV === "object" &&
  process.env.NODE_ENV !== "dev"
) {
  // whyDidYouUpdate(React);
}

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <Switch>
        <Route path="/" name="Home" component={Full} />
      </Switch>
    </HashRouter>
  </Provider>,
  document.getElementById("root")
);

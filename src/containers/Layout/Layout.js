import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";

import { Notify } from "react-redux-notify";
import "react-redux-notify/dist/ReactReduxNotify.css";
import "../../styles/notification-styles.css";

import {
  AppAside,
  // AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav
} from "@coreui/react";
// sidebar nav config
import navigation from "../../_nav";
// routes config
import routes from "../../routes";
import Aside from "./Aside";
import Footer from "./Footer";
import Header from "./Header";

// console.log("Layout.js, routes:");
// console.log(routes);

// const customNotifyStyles = {
//   containerTopRightBelowBar: "containerTopRightBelowBar"
// };

const customNotifyStyles = {
  containerTopRightBelowBar: "containerTopRightBelowBar"
};

// <Notify customStyles={myCustomStyles} position={'CustomBottomPosition'}/>

/*
.CustomBottomPosition {
  ....
  ....
}
import {Notify} from 'react-redux-notify';
const myCustomStyles = {
  containerCustomBottomPosition: 'CustomBottomPosition'
}
<Notify customStyles={myCustomStyles} position={'CustomBottomPosition'}/>
 */

class Layout extends Component {
  render() {
    return (
      <div className="app">
        <AppHeader fixed>
          <Header />
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <AppSidebarNav navConfig={navigation} {...this.props} />
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            <Container fluid>
              <Notify
                position="TopRightBelowBar"
                customStyles={customNotifyStyles}
              />
              <Switch>
                {routes.map((route, idx) => {
                  return route.component ? (
                    <Route
                      key={idx}
                      path={route.path}
                      exact={route.exact}
                      name={route.name}
                      render={props => <route.component {...props} />}
                    />
                  ) : null;
                })}
                <Redirect from="/" to="/edithomepage" />
              </Switch>
            </Container>
          </main>
          <AppAside fixed>
            <Aside />
          </AppAside>
        </div>
        <AppFooter>
          <Footer />
        </AppFooter>
      </div>
    );
  }
}

export default Layout;

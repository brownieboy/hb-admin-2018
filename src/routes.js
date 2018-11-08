// import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
// import { whyDidYouUpdate } from "why-did-you-update";

import configureStore from "./store/configureStore.js";
// Styles
// Import Flag Icons Set
// import "flag-icon-css/css/flag-icon.min.css";
// Import Font Awesome Icons Set
import "font-awesome/css/font-awesome.min.css";
// Import Simple Line Icons Set
import "simple-line-icons/css/simple-line-icons.css";
// Import Main styles for this application
import "./scss/style.scss";
// Temp fix for reactstrap
// import "./scss/core/_dropdown-menu-right.scss";

// Containers
import Full from "./containers/Full/";
import Loadable from "react-loadable";
// import DefaultLayout from "./containers/DefaultLayout";

function Loading() {
  return <div>Loading...</div>;
}

// const Breadcrumbs = Loadable({
//   loader: () => import("./views/Base/Breadcrumbs"),
//   loading: Loading
// });
// const Header = Loadable({
//   loader: () => import("../../components/Header/"),
//   loading: Loading
// });
// const Sidebar = Loadable({
//   loader: () => import("../../components/Sidebar/"),
//   loading: Loading
// });
// const Breadcrumb = Loadable({
//   loader: () => import("../../components/Breadcrumb/"),
//   loading: Loading
// });
// const Aside = Loadable({
//   loader: () => import("../../components/Aside/"),
//   loading: Loading
// });
// const Footer = Loadable({
//   loader: () => import("../../components/Footer/"),
//   loading: Loading
// });

// const Dashboard = Loadable({
//   loader: () => import("../../views/Dashboard/"),
//   loading: Loading
// });

const Bands = Loadable({
  loader: () => import("./views/bands-conn.js"),
  loading: Loading
});
const Schedule = Loadable({
  loader: () => import("./views/schedule-conn.js"),
  loading: Loading
});
const Stages = Loadable({
  loader: () => import("./views/stages-conn.js"),
  loading: Loading
});
const Photos = Loadable({
  loader: () => import("./views/photos-conn.js"),
  loading: Loading
});

const BandForm = Loadable({
  loader: () => import("./views/bands-conn.js"),
  loading: Loading
});
const EditHomePage = Loadable({
  loader: () => import("./containers/home-form-conn.js"),
  loading: Loading
});
const StageForm = Loadable({
  loader: () => import("./containers/stage-form-conn.js"),
  loading: Loading
});
const ScheduleForm = Loadable({
  loader: () => import("./containers/schedule-form-conn.js"),
  loading: Loading
});
const LoginEmailForm = Loadable({
  loader: () => import("./containers/loginemailform-conn.js"),
  loading: Loading
});



// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: "/", extact: true, name: "Home", component: EditHomePage },
  { path: "/homepage", extact: true, name: "HomePage", component: EditHomePage },
  { path: "/bands", extact: true, name: "Bands", component: Bands },
  { path: "/schedule", extact: true, name: "Schedule", component: Schedule },
  { path: "/stages", extact: true, name: "Stages", component: Stages },
  {
    path: "/stageform",
    extact: true,
    name: "StageForm",
    component: StageForm
  },
  { path: "/bandform", extact: true, name: "BandForm", component: BandForm },
  {
    path: "/scheduleform",
    extact: true,
    name: "ScheduleForm",
    component: ScheduleForm
  },
  {
    path: "/loginemailform",
    extact: true,
    name: "LoginEmailForm",
    component: LoginEmailForm
  },
  { path: "/photos", extact: true, name: "Photos", component: Photos }
];

export default routes;

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

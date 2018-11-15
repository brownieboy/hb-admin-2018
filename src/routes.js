// import "babel-polyfill";
import React from "react";
// import { whyDidYouUpdate } from "why-did-you-update";

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
// import Full from "./containers/Full/";
import loadable from "react-loadable";
// import DefaultLayout from "./containers/DefaultLayout";

function Loading() {
  return <div>Loading...</div>;
}

// const Breadcrumbs = loadable({
//   loader: () => import("./views/Base/Breadcrumbs"),
//   loading: Loading
// });
// const Header = loadable({
//   loader: () => import("../../components/Header/"),
//   loading: Loading
// });
// const Sidebar = loadable({
//   loader: () => import("../../components/Sidebar/"),
//   loading: Loading
// });
// const Breadcrumb = loadable({
//   loader: () => import("../../components/Breadcrumb/"),
//   loading: Loading
// });
// const Aside = loadable({
//   loader: () => import("../../components/Aside/"),
//   loading: Loading
// });
// const Footer = loadable({
//   loader: () => import("../../components/Footer/"),
//   loading: Loading
// });

// const Dashboard = loadable({
//   loader: () => import("../../views/Dashboard/"),
//   loading: Loading
// });

const Bands = loadable({
  loader: () => import("./views/bands-conn.js"),
  loading: Loading
});
const Schedule = loadable({
  loader: () => import("./views/schedule-conn.js"),
  loading: Loading
});
const Stages = loadable({
  loader: () => import("./views/stages-conn.js"),
  loading: Loading
});
const Photos = loadable({
  loader: () => import("./views/photos-conn.js"),
  loading: Loading
});

// BandFormNewConn
const BandFormNew = loadable({
  loader: () => import("./containers/band-form-conn.js"),
  render(loaded, props) {
    let Component = loaded.BandFormNewConn;
    return <Component {...props} />;
  },
  loading: Loading
});
const BandFormEdit = loadable({
  loader: () => import("./containers/band-form-conn.js"),
  render(loaded, props) {
    let Component = loaded.BandFormEditConn;
    return <Component {...props} />;
  },
  loading: Loading
});

const EditHomePage = loadable({
  loader: () => import("./containers/home-form-conn.js"),
  loading: Loading
});

// This is how you load named exports (i.e. not default exports) dynamically
const StageFormNew = loadable({
  loader: () => import("./containers/stage-form-conn.js"),
  loading: Loading,
  render(loaded, props) {
    let Component = loaded.StageFormNewConn;
    return <Component {...props} />;
  }
});

const StageFormEdit = loadable({
  loader: () => import("./containers/stage-form-conn.js"),
  loading: Loading,
  render(loaded, props) {
    let Component = loaded.StageFormEditConn;
    return <Component {...props} />;
  }
});

const ScheduleFormNew = loadable({
  loader: () => import("./containers/schedule-form-conn.js"),
  render(loaded, props) {
    let Component = loaded.ScheduleFormNewConn;
    return <Component {...props} />;
  },
  loading: Loading
});

const ScheduleFormEdit = loadable({
  loader: () => import("./containers/schedule-form-conn.js"),
  render(loaded, props) {
    let Component = loaded.ScheduleFormEditConn;
    return <Component {...props} />;
  },
  loading: Loading
});

const PhotoFormNew = loadable({
  loader: () => import("./containers/photo-form-conn.js"),
  render(loaded, props) {
    let Component = loaded.PhotoFormNewConn;
    return <Component {...props} />;
  },
  loading: Loading
});

const PhotoFormEdit = loadable({
  loader: () => import("./containers/photo-form-conn.js"),
  render(loaded, props) {
    let Component = loaded.PhotoFormEditConn;
    return <Component {...props} />;
  },
  loading: Loading
});

loadable({
  loader: () => import("./containers/schedule-form-conn.js"),
  render(loaded, props) {
    let Component = loaded.ScheduleFormEditConn;
    return <Component {...props} />;
  },
  loading: Loading
});

const LoginEmailForm = loadable({
  loader: () => import("./containers/loginemailform-conn.js"),
  loading: Loading
});
const ContactUsPage = loadable({
  loader: () => import("./containers/contactus-form-conn.js"),
  loading: Loading
});
const DatesEditForm = loadable({
  loader: () => import("./containers/dates-form-conn.js"),
  loading: Loading
});

const routes = [
  { path: "/edithomepage", exact: true, name: "Home", component: EditHomePage },
  { path: "/homepage", exact: true, name: "HomePage", component: EditHomePage },
  { path: "/bands", exact: true, name: "Bands", component: Bands },
  { path: "/schedule", exact: true, name: "Schedule", component: Schedule },
  { path: "/stages", exact: true, name: "Stages", component: Stages },
  {
    path: "/stageform",
    exact: true,
    name: "StageForm",
    component: StageFormNew
  },
  {
    path: "/stageform/:id",
    exact: true,
    name: "StageFormEdit",
    component: StageFormEdit
  },
  {
    path: "/bandform",
    exact: true,
    name: "BandFormNew",
    component: BandFormNew
  },
  {
    path: "/bandform/:id",
    exact: true,
    name: "BandFormEdit",
    component: BandFormEdit
  },
  {
    path: "/scheduleform",
    exact: true,
    name: "ScheduleFormNew",
    component: ScheduleFormNew
  },
  {
    path: "/scheduleform/:id",
    exact: true,
    name: "ScheduleFormEdit",
    component: ScheduleFormEdit
  },
  {
    path: "/loginemailform",
    exact: true,
    name: "LoginEmailForm",
    component: LoginEmailForm
  },
  { path: "/photos", exact: true, name: "Photos", component: Photos },
  {
    path: "/photoform",
    exact: true,
    name: "PhotoFormNew",
    component: PhotoFormNew
  },
  {
    path: "/photoform/:id",
    exact: true,
    name: "PhtoFormEdit",
    component: PhotoFormEdit
  },
  {
    path: "/contactuspage",
    exact: true,
    name: "ContactUsPage",
    component: ContactUsPage
  },
  {
    path: "/dates",
    exact: true,
    name: "DatesPage",
    component: DatesEditForm
  }
];

export default routes;

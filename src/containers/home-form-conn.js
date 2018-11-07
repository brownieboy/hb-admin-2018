import { bindActionCreators } from "redux";
import { connect } from "react-redux";

// Components
import HomeForm from "../components/home-form.js";

// Dux
import {
  // saveNewHome,
  saveEditedHome
} from "../dux/homeReducer.js";

import { notifyInfo } from "../dux/react-redux-notify-helpers.js";

const getCommonStateObject = state => ({
  fetchStatus: state.homeState.fetchStatus,
  fetchError: state.homeState.fetchError,
  saveStatus: state.homeState.saveStatus,
  saveError: state.homeState.saveError,
  isLoggedIn: state.firebaseLoginState.loggedIn
});

// So we're connecting the same form to Redux, but with different props
// and state depending on whether we're creating a new one or
// editing an existing one
// const mapDispatchToPropsNew = dispatch =>
//   bindActionCreators({ submitDataToServer: saveNewHome }, dispatch);
// const mapStateToPropsNew = state => ({
//   ...getCommonStateObject(state),
//   isEditExisting: false
// });

const mapDispatchToPropsEdit = dispatch =>
  bindActionCreators({ notifyInfo, submitDataToServer: saveEditedHome }, dispatch);

const mapStateToPropsEdit = state => ({
  ...getCommonStateObject(state),
  homeText: state.homeState.homeText,
  isEditExisting: true
});

// export const HomeFormNewConn = connect(
//   mapStateToPropsNew,
//   mapDispatchToPropsNew
// )(HomeForm);

const HomeFormEditConn = connect(mapStateToPropsEdit, mapDispatchToPropsEdit)(
  HomeForm
);

export default HomeFormEditConn;

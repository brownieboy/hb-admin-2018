import { bindActionCreators } from "redux";
import { connect } from "react-redux";

// Components
import DatesForm from "../components/dates-form.js";

// Dux
import { saveEditedDates, selectCurrentYear } from "../dux/datesReducer.js";
import { notifyInfo } from "../dux/react-redux-notify-helpers.js";

const mapDispatchToProps = dispatch =>
  bindActionCreators({ notifyInfo, submitDataToServer: saveEditedDates }, dispatch);

const mapStateToProps = state => ({
  saveStatus: state.datesState.saveStatus,
  saveError: state.datesState.saveError,
  fetchStatus: state.datesState.fetchStatus,
  fetchError: state.datesState.fetchError,
  datesList: state.datesState.datesList,
  isEditExisting: true,
  isLoggedIn: state.firebaseLoginState.loggedIn,
  thisYear: selectCurrentYear(state)
});

const DatesFormConn = connect(mapStateToProps, mapDispatchToProps)(DatesForm);

export default DatesFormConn;

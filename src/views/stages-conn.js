import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import {
  deleteStages,
  selectStages
} from "../dux/stagesReducer.js";

import { selectStagesEnhanced } from "../dux/selectors/reselect-selectors.js";

// Components
import Stages from "./stages.js";

const mapDispatchToProps = dispatch =>
  bindActionCreators({ deleteStages }, dispatch);

const mapStateToProps = state => ({
  fetchStatus: state.stagesState.fetchStatus,
  fetchError: state.stagesState.fetchError,
  stagesListProp: selectStages(state),
  selectStagesEnhanced: selectStagesEnhanced(state),
  isLoggedIn: state.firebaseLoginState.loggedIn
});

const StagesConn = connect(mapStateToProps, mapDispatchToProps)(Stages);

export default StagesConn;

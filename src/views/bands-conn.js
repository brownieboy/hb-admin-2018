import { bindActionCreators } from "redux";
import { connect } from "react-redux";

// Components
import Bands from "./bands.js";

// Dux stuff
import {
  loadBandsNow,
  addBandsToAppearInYear,
  adjustBandsSave,
  removeBandsFromAppearingInYear,
  deleteBands
} from "../dux/bandsReducer.js";
import {
  selectThisYearsBands,
  selectBandsAlphabeticalEnhanced
} from "../dux/selectors/reselect-selectors.js";

import { selectCurrentYear } from "../dux/datesReducer.js";

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addBandsToAppearInYear,
      adjustBandsSave,
      removeBandsFromAppearingInYear,
      deleteBands,
      loadBandsProp: loadBandsNow
    },
    dispatch
  );

const mapStateToProps = state => ({
  fetchStatus: state.bandsState.fetchStatus,
  fetchError: state.bandsState.fetchError,
  // bandsListProp: state.bandsState.bandsList,
  selectBandsAlphabeticalEnhanced: selectBandsAlphabeticalEnhanced(state),
  thisYear: selectCurrentYear(state),
  thisYearsBandsList: selectThisYearsBands(state),
  isLoggedIn: state.firebaseLoginState.loggedIn
});

const BandsConn = connect(
  mapStateToProps,
  mapDispatchToProps
)(Bands);

export default BandsConn;

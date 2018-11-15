import { bindActionCreators } from "redux";
import { connect } from "react-redux";

// Components
import BandForm from "../components/band-form.js";

// Dux
import {
  // bandStartCardFileUpload,
  // bandStartThumbFileUpload,
  saveNewBand,
  saveEditedBand,
  saveBandClear,
  getBandInfoForId as getBandInfoForIdAction
} from "../dux/bandsReducer.js";

import { getAppearancesForBandId } from "../dux/appearancesReducer.js";
import { selectCurrentYear, yearsAvailable } from "../dux/datesReducer.js";
import {
  saveNewPhoto
} from "../dux/photosReducer.js";

import {
  selectCardPhotosForBand,
  selectThumbPhotosForBand
} from "../dux/selectors/reselect-selectors.js";

// import {
//   sendStorageCardStart,
//   sendStorageThumbStart
// } from "../dux/storageReducer.js";

import { notifyInfo } from "../dux/react-redux-notify-helpers.js";

const getCommonStateObject = state => ({
  saveStatus: state.bandsState.saveStatus,
  saveError: state.bandsState.saveError,
  // bandsListProp: state.bandsState.bandsList,
  //   getAppearancesForBandId: bandId =>
  getAppearancesForBandId: bandId =>
    getAppearancesForBandId(state.appearancesState.appearancesList, bandId),
  getBandInfoForId: bandId =>
    getBandInfoForIdAction(state.bandsState.bandsList, bandId),
  selectCardPhotosForBand: bandId => selectCardPhotosForBand(state, bandId),
  selectThumbPhotosForBand: bandId => selectThumbPhotosForBand(state, bandId),
  isLoggedIn: state.firebaseLoginState.loggedIn,
  thisYear: selectCurrentYear(state),
  yearsAvailable: yearsAvailable(state)
});

// So we're connecting the same form to Redux, but with different props
// and state depending on whether we're creating a new one or
// editing an existing one
const mapDispatchToPropsNew = dispatch =>
  bindActionCreators(
    {
      notifyInfo,
      submitDataToServer: saveNewBand,
      saveBandClear
    },
    dispatch
  );

const mapStateToPropsNew = state => ({
  ...getCommonStateObject(state),
  isEditExisting: false
});

const mapDispatchToPropsEdit = dispatch =>
  bindActionCreators(
    {
      notifyInfo,
      submitDataToServer: saveEditedBand,
      saveNewPhoto
      // sendStorageThumbStart: bandStartThumbFileUpload,
      // sendStorageCardStart: bandStartCardFileUpload
    },
    dispatch
  );
const mapStateToPropsEdit = state => ({
  ...getCommonStateObject(state),
  // thumbFullUrl: state.storageState.thumbFullUrl,
  isEditExisting: true
});

export const BandFormNewConn = connect(
  mapStateToPropsNew,
  mapDispatchToPropsNew
)(BandForm);

export const BandFormEditConn = connect(
  mapStateToPropsEdit,
  mapDispatchToPropsEdit
)(BandForm);

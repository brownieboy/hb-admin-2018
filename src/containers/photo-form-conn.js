import { bindActionCreators } from "redux";
import { connect } from "react-redux";

// Components
import PhotoForm from "../components/photo-form.js";

// Dux
import {
  startFileUpload,
  saveNewPhoto,
  saveEditedPhoto,
  getPhotoInfoForId
  // saveBandClear,
  // getBandInfoForId as getBandInfoForIdAction
} from "../dux/photosReducer.js";


import {
  selectBandsPicker,
  selectStagesPicker
} from "../dux/selectors/reselect-selectors.js";

import { notifyInfo } from "../dux/react-redux-notify-helpers.js";

const getCommonStateObject = state => ({
  saveStatus: state.photosState.saveStatus,
  saveError: state.photosState.saveError,
  isLoggedIn: state.firebaseLoginState.loggedIn,
  bandsPicker: selectBandsPicker(state),
  stagesPicker: selectStagesPicker(state),
  getPhotoInfoForId: id => getPhotoInfoForId(state, id)
  //   photoStatus: state.photosStorageState.photoStatus,
  //   photoError: state.photosStorageState.photoError,
  //   photoProgress: state.photosStorageState.photoProgress
});

// So we're connecting the same form to Redux, but with different props
// and state depending on whether we're creating a new one or
// editing an existing one
const mapDispatchToPropsNew = dispatch =>
  bindActionCreators(
    {
      notifyInfo,
      submitDataToServer: saveNewPhoto
    },
    dispatch
  );

const mapStateToPropsNew = state => ({
  ...getCommonStateObject(state),
        submitDataToServer: saveNewPhoto,
  isEditExisting: false
});

const mapDispatchToPropsEdit = dispatch =>
  bindActionCreators(
    {
      notifyInfo,
      submitDataToServer: saveEditedPhoto,
      sendStorageStart: startFileUpload
    },
    dispatch
  );

/*
const mapStateToProps = (state, props) => ({
  // bandsAlphabetical: bandSelectors.selectAlphabetical(state),
  // appearancesByBandThenDateTime: appearancesSelectors.selectAppearancesByBandNameThenDateTime(
  //   state
  // ),
  // favouritesState: state.favouritesState,
  selectAppearancesForBandByDateTime: selectAppearancesForBandByDateTime(
    state,
    props
  ),
  selectBandDetails: selectBandDetails(state, props),
  selectFavouriteStatus: selectFavouriteStatusForBandId(state, props)
});

 */

const mapStateToPropsEdit = state => ({
  ...getCommonStateObject(state),
  // thumbFullUrl: state.storageState.thumbFullUrl,
  isEditExisting: true
});

export const PhotoFormNewConn = connect(
  mapStateToPropsNew,
  mapDispatchToPropsNew
)(PhotoForm);

export const PhotoFormEditConn = connect(
  mapStateToPropsEdit,
  mapDispatchToPropsEdit
)(PhotoForm);

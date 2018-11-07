import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  selectPhotosEnhanced,
  selectBandPhotos,
  selectStagePhotos
} from "../dux/selectors/reselect-selectors.js";

import { startDeletePhotosProcess } from "../dux/photosReducer.js";
import PhotosWrapper from "./photos-wrapper.js";

const mapStateToProps = state => ({
  selectPhotos: selectPhotosEnhanced(state),
  selectBandPhotos: selectBandPhotos(state),
  selectStagePhotos: selectStagePhotos(state),
  isLoggedIn: state.firebaseLoginState.loggedIn
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      startDeletePhotosProcess
    },
    dispatch
  );



const PhotosConn = connect(
  mapStateToProps,
  mapDispatchToProps
)(PhotosWrapper);

export default PhotosConn;

// import { bindActionCreators } from "redux";
import { connect } from "react-redux";

// Components
import ImageUploader from "../components/imageuploader.js";

// Dux
import {
  // startFileUpload,
  // saveNewPhoto,
  // saveEditedPhoto,
  getPhotoInfoForId
} from "../dux/photosReducer.js";

import { getUploadingPhotoProgressForId } from "../dux/photosStorageReducer.js";

// import { getUploadingPhotosList } from "../dux/photosStorageReducer.js";

// import { notifyInfo } from "../dux/react-redux-notify-helpers.js";

const mapStateToProps = state => ({
  getPhotoInfoForId: id => getPhotoInfoForId(state, id),
  getUploadingPhotoProgressForId: id =>
    getUploadingPhotoProgressForId(state, id)
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImageUploader);

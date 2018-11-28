import React, { Component } from "react";
import PropTypes from "prop-types";
import UploadProgressBar from "./uploadprogressbar.js";

class ImageUploader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stateProgress: 0
    };
  }

  static getDerivedStateFromProps(props, state) {
    // Any time the current user changes,
    // Reset any parts of state that are tied to that user.
    // In this simple example, that's just the email.
    const { getUploadingPhotoProgressForId, photoId, handleProgressReachedMax } = props;
    const photoProgress = getUploadingPhotoProgressForId(photoId);
    if (photoProgress !== state.stateProgress) {
      if (photoProgress === 100 && handleProgressReachedMax) {
        console.log("getDerivedStateFromProps.. photoProgress = 100%!");
        handleProgressReachedMax();
      }
      return {
        stateProgress: photoProgress
      };
    }
    return null;
  }

  render() {
    const {
      inputDisabled = false,
      // getPhotoInfoForId,
      // getUploadingPhotoProgressForId,
      // photoId,
      fileName = "",
      handleFileUpload,
      handleFileChange
    } = this.props;

    const displayProgressBar =
      fileName && fileName !== "" && fileName !== "unknown";
    // const matchingPhotoInfo = getPhotoInfoForId(photoId);
    // const photoProgress = getUploadingPhotoProgressForId(photoId);
    const { stateProgress } = this.state;

    return (
      <div>
        <div>
          <input
            type="file"
            disabled={inputDisabled}
            name="photoInput"
            onChange={e => {
              // Send up file info.  Object includes name, type etc
              // console.log("e.target.files[0]");
              // console.log(e.target.files[0]);
              handleFileChange(e.target.files[0]);
            }}
          />
        </div>
        <button
          disabled={!displayProgressBar}
          onClick={handleFileUpload}
          style={{ marginTop: 10 }}
        >
          Upload photo
        </button>
        <div
          style={{
            maxWidth: 200,
            display: displayProgressBar ? "block" : "none"
          }}
        >
          <UploadProgressBar photoProgress={stateProgress} />
        </div>
      </div>
    );
  }
}

ImageUploader.propTypes = {
  fileName: PropTypes.string,
  // getPhotoInfoForId: PropTypes.func.isRequired,
  getUploadingPhotoProgressForId: PropTypes.func.isRequired,
  handleFileChange: PropTypes.func.isRequired,
  handleFileUpload: PropTypes.func.isRequired,
  handleProgressReachedMax: PropTypes.func.isRequired,
  inputDisabled: PropTypes.bool,
  photoId: PropTypes.string.isRequired
};

export default ImageUploader;

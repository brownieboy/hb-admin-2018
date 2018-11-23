import React, { Component } from "react";
import PropTypes from "prop-types";
import UploadProgressBar from "./uploadprogressbar.js";

class ImageUploader extends Component {
  render() {
    const {
      inputDisabled = false,
      // getPhotoInfoForId,
      getUploadingPhotoProgressForId,
      photoId,
      fileName = "",
      handleFileUpload,
      handleFileChange
    } = this.props;


    console.log("ImageUploader..render, props:");
    console.log(this.props);
    const displayProgressBar = fileName && fileName !== "";
    // const matchingPhotoInfo = getPhotoInfoForId(photoId);
    const photoProgress = getUploadingPhotoProgressForId(photoId);
    return (
      <div>
        <h3>Image Uploader</h3>
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
          <UploadProgressBar photoProgress={photoProgress} />
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
  inputDisabled: PropTypes.bool,
  photoId: PropTypes.string.isRequired
};

export default ImageUploader;

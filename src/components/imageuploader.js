import React, { Component } from "react";
import PropTypes from "prop-types";
import UploadProgressBar from "./uploadprogressbar.js";

class ImageUploader extends Component {
  render() {
    const {
      inputDisabled = false,
      values,
      getPhotoInfoForId,
      photoId,
      photoProgress,
      handleFileUpload,
      handleFileChange,
      displayProgressBar
    } = this.props;

    const matchingPhotoInfo = getPhotoInfoForId(photoId);
    return (
      <div>
        <h3>Image Uploader</h3>
        <div>
          <input
            type="file"
            disabled={inputDisabled}
            name="photoInput"
            onChange={handleFileChange}
          />
        </div>
        <button
          disabled={!displayProgressBar}
          onClick={() => handleFileUpload(values, matchingPhotoInfo)}
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
  getPhotoInfoForId: PropTypes.func.isRequired,
  photoId: PropTypes.string.isRequired
};

export default ImageUploader;

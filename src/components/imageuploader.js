import React from "react";
import PropTypes from "prop-types";
import UploadProgressBar from "./uploadprogressbar.js";

const ImageUploader = ({
  inputDisabled = false,
  values,
  matchingPhotoInfo,
  photoProgress,
  handleFileUpload,
  handleFileChange,
  displayProgressBar
}) => (
  <div name="imagesLeftWrapper">
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

ImageUploader.propTypes = {
  disabled: PropTypes.bool.isRequired
};

export default ImageUploader;

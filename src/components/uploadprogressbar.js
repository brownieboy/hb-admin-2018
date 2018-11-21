import React from "react";
import PropTypes from "prop-types";

import { Progress } from "reactstrap";

const UploadProgressBar = ({ photoProgress = 0 }) => (
  <div>
    <div className="text-center">{parseInt(photoProgress, 10)}%</div>
    <Progress
      value={photoProgress}
      color={photoProgress === 100 ? "success" : "info"}
    />
  </div>
);

export default UploadProgressBar;

UploadProgressBar.propTypes = {
  photoProgress: PropTypes.number
};

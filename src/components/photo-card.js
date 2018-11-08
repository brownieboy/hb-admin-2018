import React from "react";
import { defaultCardPath } from "../constants/general.js";

import { cardStyles } from "../styles/image-styles.js";

const PhotoCard = ({ cardFullUrl, preview = false }) => {
  const stylesObj = preview ? cardStyles.preview : cardStyles.fullSize;
  return (
    <img
      src={cardFullUrl || defaultCardPath}
      alt="card"
      style={{
        height: stylesObj.height,
        width: stylesObj.width,
        padding: cardFullUrl ? 0 : 3,
        marginRight: 5
      }}
    />
  );
};

export default PhotoCard;

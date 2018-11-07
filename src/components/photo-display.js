import React from "react";
import { defaultThumbnailPath } from "../constants/general.js";

export const ThumbNail = ({ thumbFullUrl, size = 50, round = false }) => (
  <img
    src={thumbFullUrl || defaultThumbnailPath}
    style={{
      height: size,
      width: size,
      borderRadius: round ? "50%" : 0,
      backgroundColor: "white",
      padding: thumbFullUrl ? 0 : 3,
      marginRight: 5
    }}
  />
);

export const ThumbImage = ({ url = "", round = false }) =>
  url !== "" ? (
    <img
      name="thumbnailImage"
      style={{ height: 200, width: 200, borderRadius: round ? "50%" : 0 }}
      src={url}
    />
  ) : null;

export const CardImage = ({ url = "" }) =>
  url !== "" ? (
    <img name="cardImage" style={{ height: 300, width: 400 }} src={url} />
  ) : null;

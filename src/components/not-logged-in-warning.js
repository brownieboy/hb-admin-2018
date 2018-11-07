import React from "react";

const loginStyle = {
  fontWeight: "bold",
  color: "red"
};

const NotLoggedInWarning = () => (
  <div style={loginStyle}>
    <i className="icon-exclamation" /> You cannot save any changes until
    you login.
  </div>
);

export default NotLoggedInWarning;

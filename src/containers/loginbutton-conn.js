import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Button } from "reactstrap";

import { login, logout } from "../dux/firebaseLoginReducer.js";

const mapDispatchToProps = dispatch =>
  bindActionCreators({ loginProp: login, logoutProp: logout }, dispatch);

const mapStateToProps = state => ({
  loggedInState: state.firebaseLoginState
});

class LoginButton extends Component {
  handleLogin = () => {
    const { loginProp, logoutProp } = this.props;
    const { loggedIn } = this.props.loggedInState || false;
    console.log("loginProp() calling");
    if (loggedIn) {
      logoutProp();
    } else {
      loginProp();
    }
  };

  render() {
    const { loggedIn } = this.props.loggedInState || false;
    return (
      <Button onClick={this.handleLogin}>
        {loggedIn ? "Logout" : "Login"}
      </Button>
    );
  }
}

const loginButtonConn = connect(mapStateToProps, mapDispatchToProps)(
  LoginButton
);

export default loginButtonConn;

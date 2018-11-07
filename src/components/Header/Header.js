import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, NavbarToggler, NavbarBrand } from "reactstrap";

import LoginButton from "../../containers/loginbutton-conn.js";
import PublishButton from "../../containers/publishbutton-conn.js";

class Header extends Component {
  sidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle("sidebar-hidden");
  }

  sidebarMinimize(e) {
    e.preventDefault();
    document.body.classList.toggle("sidebar-minimized");
  }

  mobileSidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle("sidebar-mobile-show");
  }

  asideToggle(e) {
    e.preventDefault();
    document.body.classList.toggle("aside-menu-hidden");
  }

  render() {
    return (
      <header className="app-header navbar">
        <NavbarToggler className="d-lg-none" onClick={this.mobileSidebarToggle}>
          <span className="navbar-toggler-icon" />
        </NavbarToggler>
        <NavbarToggler
          className="d-md-down-none mr-auto"
          onClick={this.sidebarToggle}
        >
          <span className="navbar-toggler-icon" />
        </NavbarToggler>
        <div>
          <Button color="primary" style={{ marginRight: 5 }}>
            <Link
              to={"/loginemailform"}
              style={{ display: "block", height: "100%", color: "white" }}
            >
              Login Page
            </Link>
          </Button>
          |
          <span style={{ marginLeft: 5 }}>
            <PublishButton />
          </span>
        </div>
        <NavbarToggler className="d-md-down-none" onClick={this.asideToggle}>
          <span className="navbar-toggler-icon" />
        </NavbarToggler>
      </header>
    );
  }
}

export default Header;

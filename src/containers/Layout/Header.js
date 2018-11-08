import React, { Component } from "react";
import { Link } from "react-router-dom";

import {
  Badge,
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";
import PropTypes from "prop-types";

import {
  AppSidebarToggler
} from "@coreui/react";

import PublishButton from "..//publishbutton-conn.js";

const propTypes = {
  children: PropTypes.node
};

const defaultProps = {};

class DefaultHeader extends Component {
  render() {
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppSidebarToggler className="d-md-down-none" display="lg" />
        <Nav className="ml-auto" navbar>
          <Button color="primary" style={{ marginRight: 5 }}>
            <Link
              to={"/loginemailform"}
              style={{ display: "block", height: "100%", color: "white" }}
            >
              Login Page
            </Link>
          </Button> | 
          <span style={{ marginLeft: 5 }}>
            <PublishButton />
          </span>
        </Nav>
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;

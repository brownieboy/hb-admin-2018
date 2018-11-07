import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  Button,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";
import classnames from "classnames";

import { handleCheck as handleCheckExt } from "../components/lifecycleextras.js";
import ScheduleByDayStage from "./schedule-bydaystage.js";
import ScheduleByDay from "./schedule-byday.js";
import ConfirmModal from "../components/confirm-modal.js";
import NotLoggedInWarning from "../components/not-logged-in-warning.js";
import { buttonsBottomWrapperStyles } from "./viewstyles.js";
import {
  getScrollHeightPercent,
  MOBILEWIDTHCUTOFF,
  HEADERFOOTERSIZE
} from "../constants/general.js";

class AdjustTimesModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      minutesToAdjustText: ""
    };
  }

  render() {
    const { displayModal = false, handleOk, handleCancel } = this.props;
    const { minutesToAdjustText } = this.state;
    return (
      <Modal isOpen={displayModal}>
        <ModalHeader>Adjust Times</ModalHeader>
        <ModalBody>
          Enter the number of minutes you want to start and end times by. A
          negative number will move the times forward.
          <FormGroup>
            <Label for="id">Minutes to adjust by:</Label>
            <Input
              type="text"
              placeholder="Number of minutes to adjust"
              onChange={e => {
                this.setState({
                  minutesToAdjustText: e.target.value
                });
              }}
              value={minutesToAdjustText}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            disabled={minutesToAdjustText === ""}
            onClick={() => handleOk(parseInt(minutesToAdjustText, 10))}
          >
            Ok
          </Button>{" "}
          <Button color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

class ScheduleWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItems: [],
      showAdjustTimesModal: false,
      showConfirmDeleteModal: false,
      adjustmentsMadeDirtyArray: [], // Array of Ids adjusted (but not saved)
      activeTab: "byDay",
      scrollHeightPercent: 70,
      browserWidth: 400
    };
    this.handleCheck = handleCheckExt.bind(this);
  }

  updateBrowserSizes = () => {
    this.setState({
      scrollHeightPercent: getScrollHeightPercent(),
      browserWidth: window.innerWidth
    });
  };

  handleDeleteItems = () => {
    this.setState({ showConfirmDeleteModal: true });
  };

  handleAdjustItemsTimes = () => {
    this.setState({ showAdjustTimesModal: true });
  };

  // Write adjusment changes to the back end.
  handleAdjustItemsTimesSave = () => {
    this.props.adjustAppearancesSave();
    this.setState({ adjustmentsMadeDirtyArray: [] });
  };

  componentDidMount() {
    const scheduleViewActiveTab = localStorage.getItem("scheduleViewActiveTab");
    this.setState({
      activeTab: scheduleViewActiveTab,
      scrollHeightPercent: getScrollHeightPercent(),
      browserWidth: window.innerWidth
    });
    window.addEventListener("resize", this.updateBrowserSizes);
  }

  componentWillUnmount() {
    localStorage.setItem("scheduleViewActiveTab", this.state.activeTab);
    window.removeEventListener("resize", this.updateBrowserSizes);
  }

  toggleTab = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  };

  render() {
    const {
      adjustAppearances,
      adjustAppearancesSave,
      deleteAppearances,
      isLoggedIn
    } = this.props;
    const {
      adjustmentsMadeDirtyArray,
      browserWidth,
      scrollHeightPercent,
      selectedItems
    } = this.state;

    const mobileWidth = browserWidth <= MOBILEWIDTHCUTOFF;
    return (
      <Fragment>
        <div style={{ maxWidth: "530px" }}>
          {!isLoggedIn && <NotLoggedInWarning />}
          {/* <h1 style={{ fontSize: "1.6em" }}>Schedule</h1> */}

          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "byDay"
                })}
                onClick={() => {
                  this.toggleTab("byDay");
                }}
              >
                by Day
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "byDayStage"
                })}
                onClick={() => {
                  this.toggleTab("byDayStage");
                }}
              >
                by Day then Stage
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={this.state.activeTab}>
            <TabPane
              tabId="byDayStage"
              style={{
                height: `${scrollHeightPercent}vh`,
                overflowY: "auto"
              }}
            >
              <ScheduleByDayStage
                {...this.props}
                handleCheck={this.handleCheck}
                selectedItems={selectedItems}
                adjustmentsMadeDirtyArray={adjustmentsMadeDirtyArray}
              />
            </TabPane>
          </TabContent>

          <TabContent activeTab={this.state.activeTab}>
            <TabPane
              tabId="byDay"
              style={{
                height: `${scrollHeightPercent}vh`,
                overflowY: "auto"
              }}
            >
              <ScheduleByDay
                {...this.props}
                handleCheck={this.handleCheck}
                selectedItems={selectedItems}
                adjustmentsMadeDirtyArray={adjustmentsMadeDirtyArray}
              />
            </TabPane>
          </TabContent>
        </div>
        <div style={buttonsBottomWrapperStyles}>
          <Button
            color="primary"
            size={mobileWidth ? "sm" : null}
            style={{ marginLeft: 10 }}
          >
            <Link
              to="/scheduleform"
              style={{ display: "block", height: "100%", color: "white" }}
            >
              {mobileWidth ? "Add" : "Add appearance"}
            </Link>
          </Button>

          <Button
            color="primary"
            size={mobileWidth ? "sm" : null}
            disabled={selectedItems.length === 0}
            style={{ marginLeft: 10 }}
            onClick={this.handleAdjustItemsTimes}
          >
            {mobileWidth ? "Adjust" : "Adjust selected times"}
          </Button>
          <Button
            color="success"
            size={mobileWidth ? "sm" : null}
            disabled={adjustmentsMadeDirtyArray.length === 0}
            style={{ marginLeft: 10 }}
            onClick={this.handleAdjustItemsTimesSave}
          >
            {mobileWidth ? "Save" : "Save schedule adjustments"}
          </Button>
          <Button
            color="danger"
            size={mobileWidth ? "sm" : null}
            disabled={selectedItems.length === 0}
            style={{ marginLeft: 10 }}
            onClick={this.handleDeleteItems}
          >
            {mobileWidth ? "Delete" : "Delete selected"}
          </Button>
        </div>
        <ConfirmModal
          displayModal={this.state.showConfirmDeleteModal}
          modalTitle="Delete Appearances?"
          modalBody="Are you sure that you want to delete the selected appearances?"
          handleOk={() => {
            deleteAppearances(selectedItems);
            this.setState({ showConfirmDeleteModal: false });
          }}
          handleCancel={() => this.setState({ showConfirmDeleteModal: false })}
        />
        <AdjustTimesModal
          displayModal={this.state.showAdjustTimesModal}
          handleOk={adjustMinutes => {
            adjustAppearances(selectedItems, adjustMinutes);
            const newAdjustmentsMadeDirtyArray = adjustmentsMadeDirtyArray.slice();
            selectedItems.forEach(val => {
              if (!newAdjustmentsMadeDirtyArray.includes(val)) {
                newAdjustmentsMadeDirtyArray.push(val);
              }
            });
            this.setState({
              showAdjustTimesModal: false,
              adjustmentsMadeDirtyArray: newAdjustmentsMadeDirtyArray
            });
          }}
          handleCancel={() => this.setState({ showAdjustTimesModal: false })}
        />
      </Fragment>
    );
  }
}

AdjustTimesModal.propTypes = {
  displayModal: PropTypes.bool.isRequired,
  handleOk: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired
};

ScheduleWrapper.propTypes = {
  adjustAppearances: PropTypes.func.isRequired,
  adjustAppearancesSave: PropTypes.func.isRequired,
  deleteAppearances: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
};

export default ScheduleWrapper;

import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Button,
  FormGroup,
  Input,
  Label,
  ListGroup,
  ListGroupItem
} from "reactstrap";
import { Link } from "react-router-dom";
import {
  buttonsBottomWrapperStyles,
  listGroupItemContentWrapperStyles,
  listGroupItemStyles,
  listGroupStyles,
  itemTextSpan
} from "./viewstyles.js";
import ConfirmModal from "../components/confirm-modal.js";
import AlertModal from "../components/alert-modal.js";
import { handleCheck as handleCheckExt } from "../components/lifecycleextras.js";
import { LoadStatusIndicator } from "../components/loadsaveindicator.js";
import { ThumbNail } from "../components/photo-display.js";
import NotLoggedInWarning from "../components/not-logged-in-warning.js";
import {
  getScrollHeightPercent,
  MOBILEWIDTHCUTOFF
} from "../constants/general.js";

class Bands extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bandsToDisplay: "all",
      selectedItems: [],
      showConfirmDeleteModal: false,
      showConfirmRemoveFromThisYearModal: false,
      showBandsWithAppearancesAlertModal: false,
      bandsWithAppearances: [],
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

  componentDidMount() {
    const { loadBandsProp } = this.props;
    const bandsToDisplay = localStorage.getItem("bandsViewDisplayBands");

    this.setState({
      scrollHeightPercent: getScrollHeightPercent(),
      browserWidth: window.innerWidth,
      bandsToDisplay
    });
    window.addEventListener("resize", this.updateBrowserSizes);

    loadBandsProp();
  }

  componentWillUnmount() {
    const { bandsToDisplay } = this.state;
    localStorage.setItem("bandsViewDisplayBands", bandsToDisplay);
  }

  handleCheckAll = () => {
    const { bandsToDisplay } = this.state;
    const { selectBandsAlphabeticalEnhanced, thisYearsBandsList } = this.props;
    if (bandsToDisplay === "thisYear") {
      this.setState({
        selectedItems: thisYearsBandsList.map(listItem => listItem.id)
      });
    } else {
      this.setState({
        selectedItems: selectBandsAlphabeticalEnhanced.map(listItem => listItem.id)
      });
    }
  };

  handleUncheckAll = () => {
    this.setState({
      selectedItems: []
    });
  };

  handleDeleteItems = () => {
    const { selectBandsAlphabeticalEnhanced } = this.props;
    const { selectedItems } = this.state;

    const selectedBandsWithAppearances = selectBandsAlphabeticalEnhanced.filter(
      bandItem =>
        selectedItems.includes(bandItem.id) &&
        bandItem.appearancesList &&
        bandItem.appearancesList.length > 0
    );

    if (selectedBandsWithAppearances.length === 0) {
      this.setState({ showConfirmDeleteModal: true });
    } else {
      const bandsWithAppearancesNames = selectedBandsWithAppearances
        .map(bandMember => bandMember.name)
        .sort();

      this.setState({
        showBandsWithAppearancesAlertModal: true,
        bandsWithAppearances: bandsWithAppearancesNames
      });
    }
  };

  removeItemsFromThisYear = () => {
    const { selectBandsAlphabeticalEnhanced } = this.props;
    const { selectedItems } = this.state;

    const selectedBandsWithAppearances = selectBandsAlphabeticalEnhanced.filter(
      bandItem =>
        selectedItems.includes(bandItem.id) &&
        bandItem.appearancesList &&
        bandItem.appearancesList.length > 0
    );

    if (selectedBandsWithAppearances.length === 0) {
      this.setState({ showConfirmRemoveFromThisYearModal: true });
    } else {
      const bandsWithAppearancesNames = selectedBandsWithAppearances
        .map(bandMember => bandMember.name)
        .sort();

      // console.log("bandsWithAppearancesNames:");
      // console.log(bandsWithAppearancesNames);
      this.setState({
        showBandsWithAppearancesAlertModal: true,
        bandsWithAppearances: bandsWithAppearancesNames
      });
    }
  };

  addItemsToThisYear = () => {
    const { adjustBandsSave, addBandsToAppearInYear, thisYear } = this.props;
    const { selectedItems } = this.state;
    // Don't forget the .slice() below, otherwise we modify the state directly!
    const selectedItemsCopy = selectedItems.slice();
    // console.log("addItemsToThisYear");
    addBandsToAppearInYear(selectedItemsCopy, thisYear);
    adjustBandsSave();
  };

  listBands = (bandsArray, thisYear) =>
    bandsArray.map(bandMember => (
      <ListGroupItem key={bandMember.id} style={listGroupItemStyles}>
        <div style={listGroupItemContentWrapperStyles}>
          <div>
            <ThumbNail
              thumbFullUrl={
                bandMember.thumbPhotoInfo
                  ? bandMember.thumbPhotoInfo.fullUrl
                  : ""
              }
              round={true}
            />
            {typeof bandMember.yearsAppearing !== "undefined" &&
            bandMember.yearsAppearing.includes(thisYear) ? (
              <i className="fa fa-thumbs-o-up" style={{ marginLeft: "5px" }} />
            ) : (
              <span style={{ marginLeft: "15px" }} />
            )}
            <Link to={`/bandform/${bandMember.id}`}>
              <span style={itemTextSpan}>{bandMember.name}</span>
            </Link>
          </div>
          <div style={{ height: "20px" }}>
            <Input
              type="checkbox"
              className="form-check-input"
              checked={this.state.selectedItems.includes(bandMember.id)}
              onChange={e => this.handleCheck(e, bandMember.id)}
            />
            {/*  <Link to={`/bandform/${bandMember.id}`} style={{ marginLeft: 10 }}>
              <i className="icon-pencil" />
            </Link> */}
          </div>
        </div>
      </ListGroupItem>
    ));

  render() {
    const {
      adjustBandsSave,
      selectBandsAlphabeticalEnhanced,
      thisYearsBandsList,
      deleteBands,
      removeBandsFromAppearingInYear,
      fetchError,
      fetchStatus,
      isLoggedIn,
      thisYear
    } = this.props;
    const { bandsToDisplay, browserWidth, scrollHeightPercent } = this.state;
    const mobileWidth = browserWidth <= MOBILEWIDTHCUTOFF;

    // console.log("bands.js, selectBandsAlphabeticalEnhanced:");
    // console.log(selectBandsAlphabeticalEnhanced);

    return (
      <div>
        {!isLoggedIn && <NotLoggedInWarning />}
        <h1 style={{ fontSize: "1.5em" }}>Bands</h1>
        <LoadStatusIndicator
          fetchStatus={fetchStatus}
          fetchError={fetchError}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "10px",
            marginBottom: "5px"
          }}
        >
          <FormGroup check style={{ marginRight: "20px" }}>
            <Label check>
              <Input
                type="radio"
                name="displayBandsRadio"
                onChange={() => {
                  this.setState({ bandsToDisplay: "all" });
                }}
                checked={bandsToDisplay !== "thisYear"}
              />{" "}
              All bands
            </Label>
            <Label style={{ marginLeft: "35px" }} check>
              <Input
                type="radio"
                name="displayBandsRadio"
                onChange={() => {
                  this.setState({
                    bandsToDisplay: "thisYear",
                    selectedItems: []
                  });
                }}
                checked={bandsToDisplay === "thisYear"}
              />{" "}
              Bands appearing in {thisYear}
            </Label>
          </FormGroup>
          <Button size="sm" color="success" onClick={this.handleCheckAll}>
            Check all
          </Button>
          <Button
            size="sm"
            color="warning"
            onClick={this.handleUncheckAll}
            style={{ marginLeft: "5px" }}
          >
            Uncheck all
          </Button>
        </div>
        <ListGroup
          style={{
            ...listGroupStyles,
            height: `${scrollHeightPercent - 3}vh`,
            overflowY: "auto"
          }}
        >
          {this.listBands(
            bandsToDisplay === "thisYear"
              ? thisYearsBandsList
              : selectBandsAlphabeticalEnhanced,
            thisYear
          )}
        </ListGroup>
        <div style={buttonsBottomWrapperStyles}>
          <Button
            color="primary"
            size={mobileWidth ? "sm" : null}
            style={{ marginLeft: 10 }}
          >
            <Link
              to="/bandform"
              style={{ display: "block", height: "100%", color: "white" }}
            >
              Add band
            </Link>
          </Button>

          <Button
            color="success"
            size={mobileWidth ? "sm" : null}
            disabled={this.state.selectedItems.length === 0}
            style={{ marginLeft: 10 }}
            onClick={this.addItemsToThisYear}
          >
            Add selected to {thisYear} lineup
          </Button>
          <Button
            color="danger"
            size={mobileWidth ? "sm" : null}
            disabled={this.state.selectedItems.length === 0}
            style={{ marginLeft: 10 }}
            onClick={this.removeItemsFromThisYear}
          >
            Remove selected from {thisYear} lineup
          </Button>
          <Button
            color="danger"
            size={mobileWidth ? "sm" : null}
            disabled={this.state.selectedItems.length === 0}
            style={{ marginLeft: 10 }}
            onClick={this.handleDeleteItems}
          >
            Delete selected
          </Button>
          <ConfirmModal
            displayModal={this.state.showConfirmDeleteModal}
            modalTitle="Delete Bands?"
            modalBody="Are you sure that you want to delete the selected bands?"
            handleOk={() => {
              deleteBands(this.state.selectedItems);
              this.setState({ showConfirmDeleteModal: false });
            }}
            handleCancel={() =>
              this.setState({ showConfirmDeleteModal: false })
            }
          />
          <ConfirmModal
            displayModal={this.state.showConfirmRemoveFromThisYearModal}
            modalTitle={`Remove bands from the ${thisYear} festival?`}
            modalBody={`Are you sure that you want to remove the selected bands from the ${thisYear} lineup?`}
            handleOk={() => {
              removeBandsFromAppearingInYear(
                this.state.selectedItems,
                thisYear
              );
              adjustBandsSave();

              this.setState({ showConfirmRemoveFromThisYearModal: false });
            }}
            handleCancel={() =>
              this.setState({ showConfirmRemoveFromThisYearModal: false })
            }
          />
          <AlertModal
            displayModal={this.state.showBandsWithAppearancesAlertModal}
            modalTitle="Bands with appearances"
            modalBody={[
              <div key="1">The following bands are making appearances:</div>,
              <div key="2" style={{ margin: 15 }}>
                {this.state.bandsWithAppearances.join(", ")}
              </div>,
              <div key="3">
                {`You must delete each of the bands' appearances from the
                Schedule view before you can remove them from the ${thisYear} lineup or delete them entirely.`}
              </div>
            ]}
            handleClose={() =>
              this.setState({ showBandsWithAppearancesAlertModal: false })
            }
          />
        </div>
      </div>
    );
  }
}

Bands.propTypes = {
  addBandsToAppearInYear: PropTypes.func.isRequired,
  adjustBandsSave: PropTypes.func.isRequired,
  removeBandsFromAppearingInYear: PropTypes.func.isRequired,
  deleteBands: PropTypes.func.isRequired,
  fetchStatus: PropTypes.string.isRequired,
  fetchError: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  loadBandsProp: PropTypes.func.isRequired,
  selectBandsAlphabeticalEnhanced: PropTypes.arrayOf(
    PropTypes.object.isRequired
  ).isRequired,
  thisYearsBandsList: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  thisYear: PropTypes.number.isRequired
};

export default Bands;

// <div>{JSON.stringify(bandsStateProp)}</div>
//
/*
      <ListGroupItem key={appearanceMember.id}>
        {`${bandInfo.name} (${bandInfo.name})`}
        <Link to={`/scheduleform/${appearanceMember.id}`}>
          <i className="icon-pencil" />
        </Link>
      </ListGroupItem>
 */
